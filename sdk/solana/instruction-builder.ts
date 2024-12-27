import { BN, Program } from "@coral-xyz/anchor";
import { SolanaSpoke } from "../../ts-types/solana/solana_spoke";
import { Connection, Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { derivePostedVaaKey, getPostMessageCpiAccounts } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { DeliveryInstruction } from "../commons/messaging-helpers/delivery_instruction";
import { deriveBaseConfigPda, deriveConsumedNoncePda, deriveCustomEmitterPda, deriveUserMessageNoncePda, deriveVaultConfigPda, deriveWormholeCoreMessageKey } from "../commons/utils/pda";
import { TunnelMessage } from "../commons/messaging-helpers/tunnel-message";
import { ReleaseFundsPayload } from "../commons/messaging-helpers/release-funds-payload";
import { ethers } from "ethers";
import { ParsedVaa } from "@certusone/wormhole-sdk";
import { getUserMessageNonceValue, HubActionType } from "../commons/utils";

export class InstructionBuilder {
  private spokeProgram: Program<SolanaSpoke>;
  private vaultConfigPda: PublicKey;
  // private customEmitterPda: PublicKey;
  private relayerVault: PublicKey;
  private relayerRewardAccount: PublicKey;
  private coreBridgePid: PublicKey;

  constructor(
    spokeProgram: Program<SolanaSpoke>,
    relayerVault: PublicKey,
    relayerRewardAccount: PublicKey,
    coreBridgePid: PublicKey
  ) {
    this.spokeProgram = spokeProgram;
    this.vaultConfigPda = deriveVaultConfigPda(this.spokeProgram.programId);
    // this.customEmitterPda = deriveCustomEmitterPda(this.spokeProgram.programId);
    this.relayerVault = relayerVault;
    this.relayerRewardAccount = relayerRewardAccount;
    this.coreBridgePid = coreBridgePid;
  }

  public async buildReleaseFundsIx(
    deliveryInstructionVaa: ParsedVaa,
    relayerKeypair: Keypair,
    coreBridgePid: PublicKey,
  ): Promise<TransactionInstruction> {
    const deliveryInstructionVaaAddress = derivePostedVaaKey(coreBridgePid, deliveryInstructionVaa.hash);
    const deliveryInstruction = DeliveryInstruction.decode(deliveryInstructionVaa.payload);
    const tunnelMessage = TunnelMessage.decode(Buffer.from(deliveryInstruction.payload));
    const releaseFundsPayload = ReleaseFundsPayload.decode(Buffer.from(tunnelMessage.target.payload));

    const recipient = new PublicKey(releaseFundsPayload.user);
    const mint = new PublicKey(releaseFundsPayload.token);
    const userMessageNonce = ethers.BigNumber.from(releaseFundsPayload.nonce);
    const consumedNoncePda = deriveConsumedNoncePda(this.spokeProgram.programId, userMessageNonce.toBigInt(), recipient);

    // make sure target address is spoke
    if (Buffer.from(deliveryInstruction.targetAddress).toString("hex") != this.spokeProgram.programId.toBuffer().toString("hex")) {
      throw Error("DeliveryInstruction target address must be spokeProgram Id")
    }

    const ix = this.spokeProgram.methods
      .releaseFunds(Array.from(deliveryInstructionVaa.hash))
      .accounts({
        relayer: relayerKeypair.publicKey,
        mint,
        recipient,
        // @ts-ignore: this Pda must be passed as it has complicated seed and Anchor TS client can't derive it 
        consumedNonce: consumedNoncePda,
        deliveryInstructionVaa: deliveryInstructionVaaAddress,
      })
      .signers([relayerKeypair])
      .instruction();

    return ix;
  }

  public async buildOutboundTransferIx(
    actionType: HubActionType,
    senderKeypair: Keypair,
    mint: PublicKey,
    amount: BN,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderKeypair.publicKey
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderKeypair.publicKey, // payer
      wormholeMessagePda
    );

    let method;
    if (actionType == HubActionType.WithdrawNative) {
      method = this.spokeProgram.methods.withdraw(amount);
    } else {
      method = this.spokeProgram.methods.borrow(amount);
    }

    const ix = await method
      .accounts({
        generic: {
          sender: senderKeypair.publicKey,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          mint,
          ...wormholeAccounts,
        }
      })
      .signers([senderKeypair])
      .instruction()

    return ix;
  }

  public async buildInboundTransferIx(
    actionType: HubActionType,
    senderKeypair: Keypair,
    mint: PublicKey,
    amount: BN,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderKeypair.publicKey
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderKeypair.publicKey, // payer
      wormholeMessagePda
    );
    let senderTokenAccount = getAssociatedTokenAddressSync(
      mint,
      senderKeypair.publicKey // owner
    );

    let method;
    if (actionType == HubActionType.Deposit) {
      method = this.spokeProgram.methods.deposit(amount)
    } else {
      method = this.spokeProgram.methods.repay(amount)
    }

    const ix = method
      .accounts({
        generic: {
          sender: senderKeypair.publicKey,
          mint,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          wormholeProgram: this.coreBridgePid,
          ...wormholeAccounts
        },
        // @ts-ignore: this account can not be resolved by Anchor and we must declare it
        senderTokenAccount: senderTokenAccount
      })
      .instruction()

    return ix;
  }

  public async pairAccountIx(
    senderKeypair: Keypair,
    userId: Buffer,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderKeypair.publicKey
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderKeypair.publicKey, // payer
      wormholeMessagePda
    );


    const ix = this.spokeProgram
      .methods.pairAccount(Array.from(userId))
      .accounts({
        generic: {
          sender: senderKeypair.publicKey,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          // This account is ignored for account pairing (mint) but must be passed
          mint: NATIVE_MINT,
          ...wormholeAccounts
        },
        // @ts-ignore: this account can not be resolved by Anchor and we must declare it
        senderTokenAccount: senderTokenAccount
      })
      .instruction()

    return ix;
  }

}
import { BN, Program } from "@coral-xyz/anchor";
import { SolanaSpoke } from "../../ts-types/solana/solana_spoke";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { utils as coreUtils } from '@wormhole-foundation/sdk-solana-core';
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { DeliveryInstruction } from "../commons/messaging-helpers/delivery-instruction";
import { deriveConsumedNoncePda, deriveWormholeCoreMessageKey } from "../commons/utils/pda";
import { TunnelMessage } from "../commons/messaging-helpers/tunnel-message";
import { ReleaseFundsPayload } from "../commons/messaging-helpers/release-funds-payload";
import { ethers } from "ethers";
import { ParsedVaa } from "../commons";
import { HubActionType } from "../commons/utils";

export class InstructionBuilder {
  private spokeProgram: Program<SolanaSpoke>;
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
    this.relayerVault = relayerVault;
    this.relayerRewardAccount = relayerRewardAccount;
    this.coreBridgePid = coreBridgePid;
  }

  public async buildReleaseFundsIx(
    deliveryInstructionVaa: ParsedVaa,
    relayerAddress: PublicKey,
    coreBridgePid: PublicKey,
  ): Promise<TransactionInstruction> {
    const deliveryInstructionVaaAddress = coreUtils.derivePostedVaaKey(coreBridgePid, deliveryInstructionVaa.hash);
    const deliveryInstruction = DeliveryInstruction.decode(deliveryInstructionVaa.payload);
    const tunnelMessage = TunnelMessage.decode(Buffer.from(deliveryInstruction.payload));
    const releaseFundsPayload = ReleaseFundsPayload.decode(Buffer.from(tunnelMessage.target.payload));

    const recipient = new PublicKey(releaseFundsPayload.user);
    const mint = new PublicKey(releaseFundsPayload.token);
    const userMessageNonce = BigInt(ethers.hexlify(releaseFundsPayload.nonce));
    const consumedNoncePda = deriveConsumedNoncePda(this.spokeProgram.programId, userMessageNonce, recipient);

    // make sure target address is spoke
    if (Buffer.from(deliveryInstruction.targetAddress).toString("hex") != this.spokeProgram.programId.toBuffer().toString("hex")) {
      throw Error("DeliveryInstruction target address must be spokeProgram Id")
    }

    const ix = this.spokeProgram.methods
      .releaseFunds(Array.from(deliveryInstructionVaa.hash))
      .accounts({
        relayer: relayerAddress,
        mint,
        recipient,
        // @ts-ignore: this Pda must be passed as it has complicated seed and Anchor TS client can't derive it 
        consumedNonce: consumedNoncePda,
        deliveryInstructionVaa: deliveryInstructionVaaAddress,
      })
      .instruction();

    return ix;
  }

  public async buildOutboundTransferIx(
    actionType: HubActionType,
    senderAddress: PublicKey,
    mint: PublicKey,
    amount: BN,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = coreUtils.getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderAddress, // payer
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
          sender: senderAddress,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          mint,
          ...wormholeAccounts,
        }
      })
      .instruction()

    return ix;
  }

  public async buildInboundTransferIx(
    actionType: HubActionType,
    senderAddress: PublicKey,
    mint: PublicKey,
    amount: BN,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = coreUtils.getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderAddress, // payer
      wormholeMessagePda
    );
    let senderTokenAccount = getAssociatedTokenAddressSync(
      mint,
      senderAddress // owner
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
          sender: senderAddress,
          mint,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          ...wormholeAccounts
        },
        // @ts-ignore: this account can not be resolved by Anchor and we must declare it
        senderTokenAccount: senderTokenAccount
      })
      .instruction()

    return ix;
  }

  public async pairAccountIx(
    senderAddress: PublicKey,
    userId: Buffer,
    userMessageNonce: bigint
  ): Promise<TransactionInstruction> {
    const wormholeMessagePda = deriveWormholeCoreMessageKey(
      this.spokeProgram.programId,
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = coreUtils.getPostMessageCpiAccounts(
      this.spokeProgram.programId,
      this.coreBridgePid,
      senderAddress, // payer
      wormholeMessagePda
    );


    const ix = this.spokeProgram
      .methods.pairAccount(Array.from(userId))
      .accounts({
        generic: {
          sender: senderAddress,
          relayerVault: this.relayerVault,
          relayerRewardAccount: this.relayerRewardAccount,
          // This account is ignored for account pairing (mint) but must be passed
          mint: NATIVE_MINT,
          ...wormholeAccounts
        }
      })
      .instruction()

    return ix;
  }

}
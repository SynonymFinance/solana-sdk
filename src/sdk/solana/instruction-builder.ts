import { BN, Program } from "@coral-xyz/anchor";
import { SolanaSpoke as SolanaSpokeDevnet } from "../../ts-types/solana/solana_spoke_devnet";
import { SolanaSpoke as SolanaSpokeMainnet } from "../../ts-types/solana/solana_spoke_mainnet";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { derivePostedVaaKey, getPostMessageCpiAccounts } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { DeliveryInstruction } from "../commons/messaging-helpers/delivery-instruction";
import { deriveConsumedNoncePda, deriveWormholeCoreMessageKey } from "../commons/utils/pda";
import { TunnelMessage } from "../commons/messaging-helpers/tunnel-message";
import { ReleaseFundsPayload } from "../commons/messaging-helpers/release-funds-payload";
import { ethers } from "ethers";
import { ParsedVaa } from "@certusone/wormhole-sdk";
import { HubActionType } from "../commons/utils";

export class InstructionBuilder {
  private spokeProgramDevnet: Program<SolanaSpokeDevnet>;
  private spokeProgramMainnet: Program<SolanaSpokeMainnet>;
  private relayerVault: PublicKey;
  private relayerRewardAccount: PublicKey;
  private coreBridgePid: PublicKey;

  constructor(
    spokeProgramDevnet: Program<SolanaSpokeDevnet>,
    spokeProgramMainnet: Program<SolanaSpokeMainnet>,
    relayerVault: PublicKey,
    relayerRewardAccount: PublicKey,
    coreBridgePid: PublicKey
  ) {
    this.spokeProgramDevnet = spokeProgramDevnet;
    this.spokeProgramMainnet = spokeProgramMainnet;
    this.relayerVault = relayerVault;
    this.relayerRewardAccount = relayerRewardAccount;
    this.coreBridgePid = coreBridgePid;
  }

  public async buildReleaseFundsIx(
    deliveryInstructionVaa: ParsedVaa,
    relayerAddress: PublicKey,
    coreBridgePid: PublicKey,
  ): Promise<TransactionInstruction> {
    const deliveryInstructionVaaAddress = derivePostedVaaKey(coreBridgePid, deliveryInstructionVaa.hash);
    const deliveryInstruction = DeliveryInstruction.decode(deliveryInstructionVaa.payload);
    const tunnelMessage = TunnelMessage.decode(Buffer.from(deliveryInstruction.payload));
    const releaseFundsPayload = ReleaseFundsPayload.decode(Buffer.from(tunnelMessage.target.payload));

    const recipient = new PublicKey(releaseFundsPayload.user);
    const mint = new PublicKey(releaseFundsPayload.token);
    const userMessageNonce = ethers.BigNumber.from(releaseFundsPayload.nonce);
    const consumedNoncePda = deriveConsumedNoncePda(this.getSpokeProgramId(), userMessageNonce.toBigInt(), recipient);

    // make sure target address is spoke
    if (Buffer.from(deliveryInstruction.targetAddress).toString("hex") != this.getSpokeProgramId().toBuffer().toString("hex")) {
      throw Error("DeliveryInstruction target address must be spokeProgram Id")
    }

    const ix = this.getSpokeProgramMethods()
      .releaseFunds(Array.from(deliveryInstructionVaa.hash))
      .accounts({
        // @ts-ignore: this account must be passed
        relayerAccount: relayerAddress,
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
      this.getSpokeProgramId(),
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.getSpokeProgramId(),
      this.coreBridgePid,
      senderAddress, // payer
      wormholeMessagePda
    );

    let method;
    if (actionType == HubActionType.WithdrawNative) {
      method = this.getSpokeProgramMethods().withdraw(amount);
    } else {
      method = this.getSpokeProgramMethods().borrow(amount);
    }

    const ix = await method
      .accounts({
        generic: {
          sender: senderAddress,
          // @ts-ignore: this account must be passed
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
      this.getSpokeProgramId(),
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.getSpokeProgramId(),
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
      method = this.getSpokeProgramMethods().deposit(amount)
    } else {
      method = this.getSpokeProgramMethods().repay(amount)
    }

    const ix = method
      .accounts({
        generic: {
          sender: senderAddress,
          mint,
          // @ts-ignore: this account must be passed
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
      this.getSpokeProgramId(),
      userMessageNonce,
      senderAddress
    );
    const wormholeAccounts = getPostMessageCpiAccounts(
      this.getSpokeProgramId(),
      this.coreBridgePid,
      senderAddress, // payer
      wormholeMessagePda
    );


    const ix = this.getSpokeProgramMethods()
      .pairAccount(Array.from(userId))
      .accounts({
        generic: {
          sender: senderAddress,
          // @ts-ignore: this account must be passed
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

  getSpokeProgramId(): PublicKey {
    const network = process.env.SOLANA_NETWORK;
    if(network === "MAINNET") {
      return this.spokeProgramMainnet.programId;
    } else if (network === "DEVNET") {
      return this.spokeProgramDevnet.programId;
    } else {
      throw new Error("Unknown network environment for IDL loading: " + network);
    }
  }

  getSpokeProgramMethods() {
    const network = process.env.SOLANA_NETWORK;
    if(network === "MAINNET") {
      return this.spokeProgramMainnet.methods;
    } else if (network === "DEVNET") {
      return this.spokeProgramDevnet.methods;
    } else {
      throw new Error("Unknown network environment for IDL loading: " + network);
    }
  }

}
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { SolanaSpoke } from "../../ts-types/solana/solana_spoke";
import idl from "../../ts-types/solana/idl/solana_spoke.json";
import { InstructionBuilder } from "./instruction-builder";
import { AccountFetcher } from "./account-fetcher";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { CONTRACTS, ParsedVaa } from "@certusone/wormhole-sdk";
import { AddressLookupTableAccount, ConfirmOptions, PublicKey, Signer, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { buildV0Transaction } from "../commons/utils/lut";
import { getNetworkFromRpcUrl } from "../../src/utils";
import { deriveUserMessageNoncePda, getUserMessageNonceValue, HubActionType, toBN } from "../commons/utils";

export enum SolanaNetwork {
  MAINNET = "mainnet",
  DEVNET = "devnet",
  LOCALHOST = "localhost"
}

export class SynonymSolanaClient {
  public accountFetcher: AccountFetcher;

  private anchorProvider: AnchorProvider;
  private spokeProgram: Program<SolanaSpoke>;
  private instructionBuilder: InstructionBuilder;
  private coreBridgePid: PublicKey;
  private relayerVault: PublicKey;
  private relayerRewardAccount: PublicKey;
  private nodeWallet: NodeWallet; 

  constructor(
    anchorProvider: AnchorProvider,
    relayerVault: PublicKey,
    relayerRewardAccount: PublicKey,
  ) {
    this.anchorProvider = anchorProvider;
    this.relayerVault = relayerVault;
    this.relayerRewardAccount = relayerRewardAccount;

    const wormholeContracts = SynonymSolanaClient.getWormholeContractsForSolanaNetwork(
      this.getNetworkFromConnection()
    );
    this.coreBridgePid = new PublicKey(wormholeContracts.solana.core);

    // In Anchor > 0.30 program address is already in IDL and we do not need to pass it separately
    this.spokeProgram = new Program(idl as SolanaSpoke, anchorProvider);
    this.instructionBuilder = new InstructionBuilder(
      this.spokeProgram,
      this.relayerVault,
      this.relayerRewardAccount,
      this.coreBridgePid
    );
    this.accountFetcher = new AccountFetcher(this.spokeProgram);

    // this is a different wrapper for anchor provider wallet
    this.nodeWallet = this.anchorProvider.wallet as NodeWallet;
  }

  public async releaseFunds(deliveryInstructionVaa: ParsedVaa): Promise<TransactionSignature> {
    const releaseFundsIx = await this.instructionBuilder.buildReleaseFundsIx(
      deliveryInstructionVaa,
      this.nodeWallet.payer,
      this.coreBridgePid,
    );

    const txSignature = this.sendTxWithConfirmation(
      this.anchorProvider,
      [this.nodeWallet.payer],
      [releaseFundsIx]
    );

    return txSignature;
  }

  public async withdraw(
    mint: PublicKey,
    amount: bigint
  ): Promise<TransactionSignature> {
    const txSignature = await this.outboundTransferTx(
      HubActionType.WithdrawNative,
      mint,
      toBN(amount)
    );

    return txSignature;
  }

  public async borrow(
    mint: PublicKey,
    amount: bigint
  ): Promise<TransactionSignature> {
    const txSignature = await this.outboundTransferTx(
      HubActionType.BorrowNative,
      mint,
      toBN(amount)
    );

    return txSignature;
  }

  public async deposit(
    mint: PublicKey,
    amount: bigint
  ): Promise<TransactionSignature> {
    const txSignature = await this.inboundTransferTx(
      HubActionType.Deposit,
      mint,
      toBN(amount)
    );

    return txSignature;
  }

  public async repay(
    mint: PublicKey,
    amount: bigint
  ): Promise<TransactionSignature> {
    const txSignature = await this.inboundTransferTx(
      HubActionType.Repay,
      mint,
      toBN(amount)
    );

    return txSignature;
  }

  public async pairAccounts(
    userId: Buffer
  ): Promise<TransactionSignature> {
    const txSignature = await this.pairAccountTx(userId);
    return txSignature;
  }

  public async updateDeliveryPrice(hubTxCostSol: bigint): Promise<[string, anchor.BN]> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    const tx = await this.spokeProgram.methods
      .updateDeliveryPrice(
        deliveryPriceConfig.spokeReleaseFundsTxCostSol,
        toBN(hubTxCostSol),
        null // do not update max delay
      )
      .accounts({
        priceKeeper: this.nodeWallet.payer.publicKey
      })
      .signers([this.nodeWallet.payer])
      .rpc();
    
    return [tx, deliveryPriceConfig.hubTxCostSol];
  }

  /*** Tx builder ***/

  async outboundTransferTx(
    actionType: HubActionType,
    mint: PublicKey,
    amount: anchor.BN
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.nodeWallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const outboundTransferIx = await this.instructionBuilder.buildOutboundTransferIx(
      actionType,
      this.nodeWallet.payer,
      mint,
      amount,
      userMessageNonce
    );

    const txSignature = this.sendTxWithConfirmation(
      this.anchorProvider,
      [this.nodeWallet.payer],
      [outboundTransferIx]
    );

    return txSignature;
  }

  async inboundTransferTx(
    actionType: HubActionType,
    mint: PublicKey,
    amount: anchor.BN,
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.nodeWallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.buildInboundTransferIx(
      actionType,
      this.nodeWallet.payer,
      mint,
      amount,
      userMessageNonce
    );

    // This tx consumes smaller amount of gas, we decrease it to 150k CU (base is 200K)
    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 150_000,
    });

    const txSignature = this.sendTxWithConfirmation(
      this.anchorProvider,
      [this.nodeWallet.payer],
      [computeIx, inboundTransferIx]
    );

    return txSignature;
  }

  async pairAccountTx(
    userId: Buffer
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.nodeWallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.pairAccountIx(
      this.nodeWallet.payer,
      userId,
      userMessageNonce
    );

    // This tx consumes smaller amount of gas, we decrease it to 150k CU (base is 200K)
    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 150_000,
    });

    const txSignature = this.sendTxWithConfirmation(
      this.anchorProvider,
      [this.nodeWallet.payer],
      [computeIx, inboundTransferIx]
    );

    return txSignature;
  }

  /**** Helpers ****/

   async sendTxWithConfirmation(
    provider: anchor.AnchorProvider,
    signers: Signer[],
    instructions: TransactionInstruction[],
    lookupTableAddress?: PublicKey,
    confirmOptions?: ConfirmOptions
  ): Promise<TransactionSignature> {
  
    let latestBlockhashData = await provider.connection.getLatestBlockhash();
  
    let lookupTableAccounts: AddressLookupTableAccount[] = [];
    if(lookupTableAddress != null) {
      const lookupTableAccount = await provider.connection
        .getAddressLookupTable(lookupTableAddress)
        .then((resp) => resp.value);
      if(lookupTableAccount === null) {
        throw new Error(`Lookup table account not found: ${lookupTableAddress.toBase58()}`);
      }  
      lookupTableAccounts = [lookupTableAccount];  
    }
    
    const txV0 = buildV0Transaction(signers, instructions, latestBlockhashData.blockhash, lookupTableAccounts);
  
    // if commitment is not defined use default provider commitment
    const commitment = confirmOptions === undefined ? provider.opts.commitment : confirmOptions.commitment;

    // will send tx and wait for confirmation
    const txSignature = await provider.sendAndConfirm(txV0, signers, { commitment });
  
    return txSignature;
  }

  static getWormholeContractsForSolanaNetwork(network: SolanaNetwork) {
    if (network == SolanaNetwork.MAINNET) {
      return CONTRACTS.MAINNET;
    } else {
      // for localhost and devnet use Wormhole testnet addresses
      // NOTE: it might by confusing but in Wormhole naming they call Solana devnet - "testnet" (as it is main network for testing)
      return CONTRACTS.TESTNET
    }
  }

  getNetworkFromConnection(): SolanaNetwork {
    return getNetworkFromRpcUrl(this.anchorProvider.connection.rpcEndpoint);
  }

}
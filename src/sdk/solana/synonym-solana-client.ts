import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { SolanaSpoke } from "../../ts-types/solana/solana_spoke";
import { solanaSpokeIdl } from "../../ts-types/solana";
import { InstructionBuilder } from "./instruction-builder";
import { AccountFetcher } from "./account-fetcher";
import { CONTRACTS, ParsedVaa } from "@certusone/wormhole-sdk";
import { LAMPORTS_PER_SOL, PublicKey, TransactionSignature } from "@solana/web3.js";
import { sendTxWithConfirmation } from "../commons/utils/lut";
import { getNetworkFromConnection, getNetworkFromRpcUrl } from "../../utils";
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
  private waitForConfirmation: boolean;

  constructor(
    anchorProvider: AnchorProvider,
    relayerVault: PublicKey,
    relayerRewardAccount: PublicKey,
    solanaNetwork: SolanaNetwork,
    waitForConfirmation: boolean
  ) {
    this.anchorProvider = anchorProvider;
    this.relayerVault = relayerVault;
    this.relayerRewardAccount = relayerRewardAccount;
    this.waitForConfirmation = waitForConfirmation;

    const wormholeContracts = SynonymSolanaClient.getWormholeContractsForSolanaNetwork(solanaNetwork);
    this.coreBridgePid = new PublicKey(wormholeContracts.solana.core);

    // In Anchor > 0.30 program address is already in IDL and we do not need to pass it separately
    this.spokeProgram = new Program(solanaSpokeIdl as SolanaSpoke, anchorProvider);
    this.instructionBuilder = new InstructionBuilder(
      this.spokeProgram,
      this.relayerVault,
      this.relayerRewardAccount,
      this.coreBridgePid
    );
    this.accountFetcher = new AccountFetcher(this.spokeProgram);
  }

  public static async new(
    anchorProvider: AnchorProvider,
    relayerVault: PublicKey,
    relayerRewardAccount: PublicKey,
    waitForConfirmation: boolean = true
  ): Promise<SynonymSolanaClient> {
    const solanaNetwork = await getNetworkFromConnection(anchorProvider.connection)
    return new SynonymSolanaClient(
      anchorProvider,
      relayerVault,
      relayerRewardAccount,
      solanaNetwork,
      waitForConfirmation
    );
  }

  public async releaseFunds(deliveryInstructionVaa: ParsedVaa): Promise<TransactionSignature> {
    const releaseFundsIx = await this.instructionBuilder.buildReleaseFundsIx(
      deliveryInstructionVaa,
      this.anchorProvider.wallet.publicKey, // relayer address
      this.coreBridgePid,
    );

    const txSignature = sendTxWithConfirmation(
      this.anchorProvider,
      [releaseFundsIx],
      this.waitForConfirmation
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

  public async pairAccount(
    userId: Buffer
  ): Promise<TransactionSignature> {
    const txSignature = await this.pairAccountTx(userId);
    return txSignature;
  }

  public async updateDeliveryPrice(hubTxCostSol: bigint): Promise<[string, anchor.BN]> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    const ix = await this.spokeProgram.methods
      .updateDeliveryPrice(
        deliveryPriceConfig.spokeReleaseFundsTxCostSol,
        toBN(hubTxCostSol),
        null // do not update max delay
      )
      .accounts({
        priceKeeper: this.anchorProvider.wallet.publicKey
      })
      .instruction()

    const txSignature = await sendTxWithConfirmation(
      this.anchorProvider,
      [ix],
      this.waitForConfirmation
    );


    return [txSignature, deliveryPriceConfig.hubTxCostSol];
  }

  /*** Config getter ***/

  public async getOneWayTripCostDelivery(): Promise<string> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    const cost = deliveryPriceConfig.hubTxCostSol;
    const result = Number(cost) / Number(LAMPORTS_PER_SOL);

    return result.toString();
  }

  public async getRoundTripCostDelivery(): Promise<string> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    const hubTxCost = deliveryPriceConfig.hubTxCostSol;
    const returnSolanaTxConst = deliveryPriceConfig.spokeReleaseFundsTxCostSol;
    const totalCost = hubTxCost.add(returnSolanaTxConst).toNumber()
    const result = totalCost / Number(LAMPORTS_PER_SOL);

    return result.toString();
  }

  /*** Tx builder ***/

  async outboundTransferTx(
    actionType: HubActionType,
    mint: PublicKey,
    amount: anchor.BN
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.anchorProvider.wallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const outboundTransferIx = await this.instructionBuilder.buildOutboundTransferIx(
      actionType,
      this.anchorProvider.wallet.publicKey, // sender
      mint,
      amount,
      userMessageNonce
    );

    const txSignature = sendTxWithConfirmation(
      this.anchorProvider,
      [outboundTransferIx],
      this.waitForConfirmation
    );

    return txSignature;
  }

  async inboundTransferTx(
    actionType: HubActionType,
    mint: PublicKey,
    amount: anchor.BN,
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.anchorProvider.wallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.buildInboundTransferIx(
      actionType,
      this.anchorProvider.wallet.publicKey, // sender
      mint,
      amount,
      userMessageNonce
    );

    // This tx consumes smaller amount of gas, we decrease it to 150k CU (base is 200K)
    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 150_000,
    });

    const txSignature = sendTxWithConfirmation(
      this.anchorProvider,
      [computeIx, inboundTransferIx],
      this.waitForConfirmation
    );

    return txSignature;
  }

  async pairAccountTx(
    userId: Buffer
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.spokeProgram.programId, this.anchorProvider.wallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.pairAccountIx(
      this.anchorProvider.wallet.publicKey, // sender
      userId,
      userMessageNonce
    );

    // This tx consumes smaller amount of gas, we decrease it to 150k CU (base is 200K)
    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 150_000,
    });

    const txSignature = sendTxWithConfirmation(
      this.anchorProvider,
      [computeIx, inboundTransferIx],
      this.waitForConfirmation
    );

    return txSignature;
  }

  /**** Helpers ****/

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
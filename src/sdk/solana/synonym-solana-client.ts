import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { SolanaSpoke as SolanaSpokeDevnet } from "../../ts-types/solana/solana_spoke_devnet";
import { SolanaSpoke as SolanaSpokeMainnet } from "../../ts-types/solana/solana_spoke_mainnet";
import { solanaSpokeIdl } from "../../ts-types/solana";
import { InstructionBuilder } from "./instruction-builder";
import { AccountFetcher } from "./account-fetcher";
import { CONTRACTS, ParsedVaa } from "@certusone/wormhole-sdk";
import { PublicKey, TransactionSignature } from "@solana/web3.js";
import { sendTxWithConfirmation } from "../commons/utils/lut";
import { getNetworkFromConnection, getNetworkFromRpcUrl } from "../../utils";
import { deriveUserMessageNoncePda, getUserMessageNonceValue, HubActionType, toBigInt, toBN } from "../commons/utils";


export enum SolanaNetwork {
  MAINNET = "mainnet",
  DEVNET = "devnet",
  LOCALHOST = "localhost"
}

export class SynonymSolanaClient {
  public accountFetcher: AccountFetcher;

  private anchorProvider: AnchorProvider;
  private spokeProgramDevnet: Program<SolanaSpokeDevnet>;
  private spokeProgramMainnet: Program<SolanaSpokeMainnet>;
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
    this.spokeProgramDevnet = new Program(solanaSpokeIdl as SolanaSpokeDevnet, anchorProvider);
    this.spokeProgramMainnet = new Program(solanaSpokeIdl as SolanaSpokeMainnet , anchorProvider);
    this.instructionBuilder = new InstructionBuilder(
      this.spokeProgramDevnet,
      this.spokeProgramMainnet,
      this.relayerVault,
      this.relayerRewardAccount,
      this.coreBridgePid
    );
    this.accountFetcher = new AccountFetcher(this.spokeProgramDevnet, this.spokeProgramMainnet);
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

    const ix = await this.spokeProgramDevnet.methods
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

  // public static async getOneWayTripCostDelivery(anchorProvider: AnchorProvider): Promise<bigint> {
  //   const spokeProgram = new Program(solanaSpokeIdl as SolanaSpoke, anchorProvider);
  //   const accountFetcher = new AccountFetcher(spokeProgram);
  //   const deliveryPriceConfig = await accountFetcher.fetchDeliveryPriceConfig();

  //   return toBigInt(deliveryPriceConfig.hubTxCostSol);
  // }

  /*** Config getters ***/

  public async getOneWayTripCostDelivery(): Promise<bigint> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    return toBigInt(deliveryPriceConfig.hubTxCostSol);
  }

  public async getRoundTripCostDelivery(): Promise<bigint> {
    const deliveryPriceConfig = await this.accountFetcher.fetchDeliveryPriceConfig();

    const hubTxCost = deliveryPriceConfig.hubTxCostSol;
    const returnSolanaTxConst = deliveryPriceConfig.spokeReleaseFundsTxCostSol;
    const totalCost = hubTxCost.add(returnSolanaTxConst);

    return toBigInt(totalCost);
  }

  /*** Tx builder ***/

  async outboundTransferTx(
    actionType: HubActionType,
    mint: PublicKey,
    amount: anchor.BN
  ): Promise<TransactionSignature> {
    const userMessageNoncePda = deriveUserMessageNoncePda(this.getSpokeProgramId(), this.anchorProvider.wallet.publicKey);
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
    const userMessageNoncePda = deriveUserMessageNoncePda(this.getSpokeProgramId(), this.anchorProvider.wallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.buildInboundTransferIx(
      actionType,
      this.anchorProvider.wallet.publicKey, // sender
      mint,
      amount,
      userMessageNonce
    );

    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 210_000,
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
    const userMessageNoncePda = deriveUserMessageNoncePda(this.getSpokeProgramId(), this.anchorProvider.wallet.publicKey);
    let userMessageNonce = await getUserMessageNonceValue(this.anchorProvider.connection, userMessageNoncePda);

    const inboundTransferIx = await this.instructionBuilder.pairAccountIx(
      this.anchorProvider.wallet.publicKey, // sender
      userId,
      userMessageNonce
    );

    // This tx consumes smaller amount of gas, we decrease it to 150k CU (base is 200K)
    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 210_000,
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

}
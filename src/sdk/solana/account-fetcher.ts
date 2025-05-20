import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { SolanaSpoke as SolanaSpokeDevnet } from "../../ts-types/solana/solana_spoke_devnet";
import { SolanaSpoke as SolanaSpokeMainnet } from "../../ts-types/solana/solana_spoke_mainnet";
import { deriveBaseConfigPda, deriveDeliveryPriceConfigPda } from "../commons/utils/pda";
import { PublicKey } from "@solana/web3.js";


export interface DeliveryPriceInfo {
  spokeReleaseFundsTxCostSol: anchor.BN;   
  hubTxCostSol: anchor.BN;      
  maxDelayBetweenUpdates: number; 
  lastUpdateTimestamp: anchor.BN;
}

export class AccountFetcher {
  private spokeProgramDevnet: Program<SolanaSpokeDevnet>;
  private spokeProgramMainnet: Program<SolanaSpokeMainnet>;

  constructor(
    spokeProgramDevnet: Program<SolanaSpokeDevnet>,
    spokeProgramMainnet: Program<SolanaSpokeMainnet>
  ) {
    this.spokeProgramDevnet = spokeProgramDevnet;
    this.spokeProgramMainnet = spokeProgramMainnet;
  }

  // this is for testing purpose do not remove
  async fetchAndPrintBaseConfig(): Promise<void> {
    const baseConfigPda = deriveBaseConfigPda(this.getSpokeProgramId());
    const baseConfigAccount = await this.getSpokeProgramAccounts().baseConfig.fetch(baseConfigPda);
    console.log(">> HubAddress : ", Buffer.from(baseConfigAccount.hubAddress as number[]).toString("hex"));
    console.log(">> HubChainId : ", baseConfigAccount.hubChainId);
    console.log(">> Solana Relayer EOA :", baseConfigAccount.relayerAccount.toBase58());
    console.log(">> Solana Relayer vault :", baseConfigAccount.relayerVault.toBase58());
    console.log(">> Solana Relayer reward account :", baseConfigAccount.relayerRewardAccount.toBase58());
  }

  async fetchHubWormholeTunnelAddress(): Promise<Buffer> {
    const baseConfigPda = deriveBaseConfigPda(this.getSpokeProgramId());
    const baseConfigAccount = await this.getSpokeProgramAccounts().baseConfig.fetch(baseConfigPda);
    const hubWormholeTunnelAddress = Buffer.from(baseConfigAccount.foreignWormholeTunnel);
    return hubWormholeTunnelAddress;
  }

  async fetchDeliveryPriceConfig(): Promise<DeliveryPriceInfo> {
    const deliveryPriceConfigPda = deriveDeliveryPriceConfigPda(this.getSpokeProgramId());
    const deliveryPriceConfig = await this.getSpokeProgramAccounts().deliveryPriceConfig.fetch(deliveryPriceConfigPda);
    return {
      spokeReleaseFundsTxCostSol: deliveryPriceConfig.spokeReleaseFundsTxCostSol,
      hubTxCostSol: deliveryPriceConfig.hubTxCostSol,
      maxDelayBetweenUpdates: deliveryPriceConfig.maxDelayBetweenUpdates,
      lastUpdateTimestamp: deliveryPriceConfig.lastUpdateTimestamp
    }
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

  getSpokeProgramAccounts() {
    const network = process.env.SOLANA_NETWORK;
    if(network === "MAINNET") {
      return this.spokeProgramMainnet.account;
    } else if (network === "DEVNET") {
      return this.spokeProgramDevnet.account;
    } else {
      throw new Error("Unknown network environment for IDL loading: " + network);
    }
  }
}
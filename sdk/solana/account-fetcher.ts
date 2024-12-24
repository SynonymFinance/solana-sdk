import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { SolanaSpoke } from "../../ts-types/solana/solana_spoke";
import { deriveBaseConfigPda, deriveDeliveryPriceConfigPda } from "../commons/utils/pda";


export interface DeliveryPriceInfo {
  spokeReleaseFundsTxCostSol: anchor.BN;   
  hubTxCostSol: anchor.BN;      
  maxDelayBetweenUpdates: number; 
  lastUpdateTimestamp: anchor.BN;
}

export class AccountFetcher {
  private spokeProgram: Program<SolanaSpoke>;

  constructor(spokeProgram: Program<SolanaSpoke>) {
    this.spokeProgram = spokeProgram;
  }

  // this is for testing purpose do not remove
  async fetchAndPrintBaseConfig(): Promise<void> {
    const baseConfigPda = deriveBaseConfigPda(this.spokeProgram.programId);
    const baseConfigAccount = await this.spokeProgram.account.baseConfig.fetch(baseConfigPda);
    console.log(">> HubAddress : ", Buffer.from(baseConfigAccount.hubAddress as number[]).toString("hex"));
    console.log(">> HubChainId : ", baseConfigAccount.hubChainId);
    console.log(">> foreign token bridge address: ", Buffer.from(baseConfigAccount.foreignTokenBridgeAddress).toString("hex"));
    console.log(">> foreign endpoint: ", baseConfigAccount.tokenBridgeForeignEndpoint.toBase58());
  }

  async fetchHubWormholeTunnelAddress(): Promise<Buffer> {
    const baseConfigPda = deriveBaseConfigPda(this.spokeProgram.programId);
    const baseConfigAccount = await this.spokeProgram.account.baseConfig.fetch(baseConfigPda);
    const hubWormholeTunnelAddress = Buffer.from(baseConfigAccount.foreignWormholeTunnel);
    return hubWormholeTunnelAddress;
  }

  async fetchDeliveryPriceConfig(): Promise<DeliveryPriceInfo> {
    const deliveryPriceConfigPda = deriveDeliveryPriceConfigPda(this.spokeProgram.programId);
    const deliveryPriceConfig = await this.spokeProgram.account.deliveryPriceConfig.fetch(deliveryPriceConfigPda);
    return {
      spokeReleaseFundsTxCostSol: deliveryPriceConfig.spokeReleaseFundsTxCostSol,
      hubTxCostSol: deliveryPriceConfig.hubTxCostSol,
      maxDelayBetweenUpdates: deliveryPriceConfig.maxDelayBetweenUpdates,
      lastUpdateTimestamp: deliveryPriceConfig.lastUpdateTimestamp
    }
  }
}
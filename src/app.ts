import { Logger } from "winston";
import { ethers } from "ethers";
import { createAnchorProvider, createSolanaConnection, createSolanaKeypair } from "./utils";
import { rootLogger } from "./log";

// TODO: remove from SDK - move to off-chain relayer and just call client from sdk to updateDeliveryPrice()
// import { DeliveryPriceUpdater } from "../sdk/solana/delivery-price-updater";


async function main() {
  
  // TODO: how to test sdk? 
  // - fetch accounts from blockchain
  // - build and send TX - than wait for error from inside of the handler (?)

  const logger = rootLogger("info", "text");

  const solanaConnection = createSolanaConnection(opts.providers);
  const solanaKeypair = createSolanaKeypair(privateKeys?.[CHAIN_ID_SOLANA]);
  const anchorProviderRetryHandler = createAnchorProvider(solanaConnection, solanaKeypair);

  logger.debug(`Relayer Solana wallet balance:  ${await anchorProviderRetryHandler.connection.getBalance(anchorProviderRetryHandler.wallet.publicKey)}`);
  logger.debug(`Relayer Solana wallet address:  ${anchorProviderRetryHandler.wallet.publicKey}`);
}

main().catch((e) => {
  console.error("Encountered unrecoverable error:");
  console.error(e);
  process.exit(1);
});

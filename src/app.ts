import { Logger } from "winston";
import { ethers } from "ethers";
import { createAnchorProvider, createSolanaConnection, createSolanaKeypair, getNetworkFromRpcUrl } from "./utils";
import { rootLogger } from "./log";
import { SOLANA_RELAYER_EOA, SOLANA_RELAYER_REWARD, SOLANA_RPC } from "./consts";
import { SynonymSolanaClient } from "../sdk/solana/synonym-solana-client";
import { NATIVE_MINT } from "@solana/spl-token";
import * as assert from "assert";
import { PublicKey } from "@solana/web3.js";

// TODO: remove from SDK - move to off-chain relayer and just call client from sdk to updateDeliveryPrice()
// import { DeliveryPriceUpdater } from "../sdk/solana/delivery-price-updater";

async function main() {
  
  const logger = rootLogger("info", "text");

  const solanaConnection = createSolanaConnection(SOLANA_RPC);
  const solanaKeypair = createSolanaKeypair(SOLANA_RELAYER_EOA);
  const anchorProvider = createAnchorProvider(solanaConnection, solanaKeypair);

  logger.debug(`Relayer Solana wallet balance:  ${await anchorProvider.connection.getBalance(anchorProvider.wallet.publicKey)}`);
  logger.debug(`Relayer Solana wallet address:  ${anchorProvider.wallet.publicKey}`);

  const wormholeContracts = SynonymSolanaClient.getWormholeContractsForSolanaNetwork(
    getNetworkFromRpcUrl(anchorProvider.connection.rpcEndpoint)
  );
  const coreBridgePid = new PublicKey(wormholeContracts.solana.core);

  console.log("Core bridge PID: ", coreBridgePid.toBase58());

  const spokeClient = new SynonymSolanaClient(
    anchorProvider,
    solanaKeypair.publicKey,
    SOLANA_RELAYER_REWARD
  );

  await spokeClient.accountFetcher.fetchAndPrintBaseConfig();

  // If we get ZeroDepositAmount it means all Instruction accounts validation was passed and we are in handler body
  await assert.rejects(
    spokeClient.deposit(NATIVE_MINT, 0n),
    /ZeroInboundTransferAmount/
  );
  console.log("Deposit check - OK");

  await assert.rejects(
    spokeClient.repay(NATIVE_MINT, 0n),
    /ZeroInboundTransferAmount/
  );
  console.log("Repay check - OK");

  await assert.rejects(
    spokeClient.withdraw(NATIVE_MINT, 0n),
    /ZeroOutboundTransferAmount/
  );
  console.log("Withdraw check - OK");

  await assert.rejects(
    spokeClient.borrow(NATIVE_MINT, 0n),
    /ZeroOutboundTransferAmount/
  );
  console.log("Borrow check - OK");

  await assert.rejects(
    spokeClient.pairAccount(Buffer.alloc(32, 0)),
    /ZeroUserAccount/
  );
  console.log("Pair account check - OK");

  // There is no simple test like above for releaseFunds() because this instruction needs a has of VAA which is posted on chain

}

main().catch((e) => {
  console.error("Encountered unrecoverable error:");
  console.error(e);
  process.exit(1);
});

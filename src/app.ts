import { createAnchorProvider, createSolanaConnection, createSolanaKeypair, getNetworkFromRpcUrl } from "./utils";
import { SOLANA_RELAYER_EOA, SOLANA_RELAYER_REWARD, SOLANA_RPC } from "./consts";
import { SynonymSolanaClient } from "./sdk/solana/synonym-solana-client";
import { NATIVE_MINT } from "@solana/spl-token";
import * as assert from "assert";
import { PublicKey } from "@solana/web3.js";
// import { Provider, SolanaAdapter, useAppKitConnection } from "@reown/appkit-adapter-solana/react";
// import type { Provider } from '@reown/appkit-adapter-solana'
// import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { AnchorProvider } from "@coral-xyz/anchor";
import { exit } from "process";
// import { AnchorWallet } from '@solana/wallet-adapter-react'


async function main() {  
  const solanaConnection = createSolanaConnection(SOLANA_RPC);
  const solanaKeypair = createSolanaKeypair(SOLANA_RELAYER_EOA);
  const anchorProvider = createAnchorProvider(solanaConnection, solanaKeypair);

  console.log(`Relayer Solana wallet balance:  ${await anchorProvider.connection.getBalance(anchorProvider.wallet.publicKey)}`);
  console.log(`Relayer Solana wallet address:  ${anchorProvider.wallet.publicKey}`);

  // const { walletProvider } = useAppKitProvider<Provider>("solana");

  // if (!walletProvider?.publicKey || !walletProvider?.signTransaction) {
  //   console.error('Wallet not connected or missing required methods');
  //   exit(0);
  // }

  // const walletFromAppKitProvider = {
  //   publicKey: walletProvider.publicKey,
  //   signTransaction: walletProvider.signTransaction.bind(walletProvider),
  //   signAllTransactions: walletProvider.signAllTransactions?.bind(walletProvider),
  // }

  // const testAnchorProvider = new AnchorProvider(
  //   solanaConnection,
  //   walletFromAppKitProvider,
  //   {
  //     commitment: 'confirmed',
  //   },
  // )
  // const { walletProvider } = useAppKitProvider<Provider>('solana')

  const wormholeContracts = SynonymSolanaClient.getWormholeContractsForSolanaNetwork(
    getNetworkFromRpcUrl(anchorProvider.connection.rpcEndpoint)
  );
  console.log("wormhole contracts : ", wormholeContracts);
  const coreBridgePid = new PublicKey(wormholeContracts.core);

  console.log("Core bridge PID: ", coreBridgePid.toBase58());

  console.log("anchor provider wallet: ", anchorProvider.wallet);

  const spokeClient = new SynonymSolanaClient(
    anchorProvider,
    // testAnchorProvider,
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
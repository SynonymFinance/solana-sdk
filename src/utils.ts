import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SolanaNetwork } from "../sdk/solana/synonym-solana-client";
import { web3 } from "@coral-xyz/anchor";
import { ProvidersOpts } from "@wormhole-foundation/relayer-engine";
import { CHAIN_ID_SOLANA, ChainId } from "@certusone/wormhole-sdk";
import { ethers } from "ethers";
import { SOLANA_DEFAULT_COMMITMENT_LEVEL, USDC_SOLANA } from "./consts";
import { SynonymEvmClient } from "../sdk/evm/synonym-evm-client";
import { Logger } from "winston";
import { extractEvmRpcUrl } from "../sdk/commons/utils";


// export function getUsdcAddressForSolanaNetwork(network: SolanaNetwork): PublicKey {
//   switch(network) {
//     case SolanaNetwork.MAINNET:
//       return new PublicKey(USDC_SOLANA.mainnet);
//     default:
//       return new PublicKey(USDC_SOLANA.devnet);  
//   }
// }

export function getNetworkFromRpcUrl(rpcUrl: string): SolanaNetwork {
  // Iterate over the enum values
  const enumValues = Object.values(SolanaNetwork);
  for (const value of enumValues) {
    if (rpcUrl.includes(value)) {
      return value as SolanaNetwork; // Type assertion to ensure correct return type
    }
  }
  // if no match it is an error
  throw Error(`Unable to find network type for ${rpcUrl}`);
}

export function createAnchorProvider(connection: Connection, keypair: Keypair): anchor.AnchorProvider {
  return new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(keypair),
    {
      commitment: SOLANA_DEFAULT_COMMITMENT_LEVEL
    }
  );
}

export function createSolanaConnection(providers: ProvidersOpts | undefined): web3.Connection {
  if(providers === undefined) {
    throw Error("Providers not defined");
  }
  const solanaRpc = providers.chains[CHAIN_ID_SOLANA]?.endpoints[0];
  if(solanaRpc === undefined) {
    throw Error("Solana rpc endpoint not defined");
  }
  console.log("Solana rpc: ", solanaRpc);

  let solanaConnection = new web3.Connection(solanaRpc, SOLANA_DEFAULT_COMMITMENT_LEVEL);
  return solanaConnection;
}

export function createSolanaKeypair(solanaPrivateKeys: any[] | undefined): Keypair {
  if (solanaPrivateKeys === undefined || solanaPrivateKeys.length < 1) {
    throw Error("Solana private key not defined");
  }
  const solanaPrivateKeyAsStr = solanaPrivateKeys[0] as string;
  const solanaPrivateKeyParsed = JSON.parse(solanaPrivateKeyAsStr) as number[];
  const solanaPrivateKey = new Uint8Array(solanaPrivateKeyParsed)

  const solanaKeypair = Keypair.fromSecretKey(solanaPrivateKey);
  return solanaKeypair;
}
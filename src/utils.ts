import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { SolanaNetwork } from "../sdk/solana/synonym-solana-client";
import { web3 } from "@coral-xyz/anchor";
import { CHAIN_ID_SOLANA } from "@certusone/wormhole-sdk";
import { SOLANA_DEFAULT_COMMITMENT_LEVEL } from "./consts";


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

// ProvidersOpts was part relayer engine lib 
export function createSolanaConnection(solanaRpc: string): web3.Connection {
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
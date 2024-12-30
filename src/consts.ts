import { PublicKey } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

export const SOLANA_DEFAULT_COMMITMENT_LEVEL = "confirmed";

export const SOLANA_RPC = process.env.SOLANA_RPC!;
export const SOLANA_RELAYER_EOA = [process.env.SOLANA_PRIVATE_KEY!];

export const SOLANA_RELAYER_VAULT = new PublicKey(process.env.SOLANA_RELAYER_VAULT!);
export const SOLANA_RELAYER_REWARD = new PublicKey(process.env.SOLANA_RELAYER_REWARD!);

// TODO: use it as in solana spoke test to pass wormhole_accounts when sending WH message
export const LOOKUP_TABLE_ADDRESS = {
  mainnet: new PublicKey("76zX2fnFsGK5KwmFW7PER6f2BuqGpoBQg8s3FHP3xVJQ"),
  testnet: new PublicKey("76zX2fnFsGK5KwmFW7PER6f2BuqGpoBQg8s3FHP3xVJQ")
}
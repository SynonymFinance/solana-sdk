import { PublicKey } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

export const SOLANA_DEFAULT_COMMITMENT_LEVEL = "confirmed";

export const SOLANA_RPC = process.env.SOLANA_RPC!;
export const SOLANA_RELAYER_EOA = [process.env.SOLANA_PRIVATE_KEY!];

export const SOLANA_RELAYER_VAULT = new PublicKey(process.env.SOLANA_RELAYER_VAULT!);
export const SOLANA_RELAYER_REWARD = new PublicKey(process.env.SOLANA_RELAYER_REWARD!);
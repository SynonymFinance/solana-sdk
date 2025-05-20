import { PublicKey } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

export const SOLANA_RPC = process.env.SOLANA_NETWORK == "MAINNET" ? process.env.SOLANA_RPC_MAINNET! : process.env.SOLANA_RPC_DEVNET!;
export const SOLANA_RELAYER_EOA = process.env.SOLANA_NETWORK == "MAINNET" ? [process.env.SOLANA_PRIVATE_KEY_MAINNET!] : [process.env.SOLANA_PRIVATE_KEY_DEVNET!];

export const SOLANA_RELAYER_VAULT = process.env.SOLANA_NETWORK == "MAINNET" ? new PublicKey(process.env.SOLANA_RELAYER_VAULT_MAINNET!) : new PublicKey(process.env.SOLANA_RELAYER_VAULT_DEVNET!);
export const SOLANA_RELAYER_REWARD = process.env.SOLANA_NETWORK == "MAINNET" ? new PublicKey(process.env.SOLANA_RELAYER_REWARD_MAINNET!) : new PublicKey(process.env.SOLANA_RELAYER_REWARD_DEVNET!);
import { PublicKey } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

export const WSOL_DECIMALS = BigInt(10 ** 9);
export const WETH_DECIMALS = BigInt(10 ** 18);
export const GWEI_DECIMALS = 10 ** 9;

export const VAA_PROCESS_MAX_RETRIES = 3;

export const SOLANA_DEFAULT_COMMITMENT_LEVEL = "confirmed";

export const SOLANA_RELAYER_VAULT = new PublicKey(process.env.SOLANA_RELAYER_VAULT!);
export const SOLANA_RELAYER_REWARD = new PublicKey(process.env.SOLANA_RELAYER_REWARD!);

export const HUB_TX_GAS_AMOUNT = Number(process.env.HUB_TX_GAS_AMOUNT) || 4000_000; 
export const SYNO_PRICE_TRACKER_URL = process.env.SYNO_PRICE_TRACKER_URL;
export const DELIVERY_ESTIMATOR_INTERVAL_MS = Number(process.env.DELIVERY_ESTIMATOR_INTERVAL_MS) || 1000;
export const DELIVERY_ESTIMATOR_TIMEOUT_MS = Number(process.env.DELIVERY_ESTIMATOR_TIMEOUT_MS) || 60000;
export const PRICE_THRESHOLD_PERCENT = Number(process.env.PRICE_THRESHOLD_PERCENT) || 30
export const ABSOLUTE_UPDATE_INTERVAL_SEC = Number(process.env.ABSOLUTE_UPDATE_INTERVAL_SEC) || 3600

export const USDC_ARBITRUM = {
  mainnet: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  // sepolia address
  testnet: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
}

export const USDC_SOLANA = {
  mainnet: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
}

export const LOOKUP_TABLE_ADDRESS = {
  mainnet: new PublicKey("76zX2fnFsGK5KwmFW7PER6f2BuqGpoBQg8s3FHP3xVJQ"),
  testnet: new PublicKey("76zX2fnFsGK5KwmFW7PER6f2BuqGpoBQg8s3FHP3xVJQ")
}
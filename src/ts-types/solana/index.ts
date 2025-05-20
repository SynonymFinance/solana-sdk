import dotenv from "dotenv";
dotenv.config();


const network = process.env.SOLANA_NETWORK;
let solanaSpokeIdl: any;

if (network === 'MAINNET') {
  solanaSpokeIdl = require('./idl-mainnet/solana_spoke.json');
} else if (network === 'DEVNET') {
  solanaSpokeIdl = require('./idl-devnet/solana_spoke.json');
} else {
  throw new Error("Unknown network environment for IDL loading: " + network);
}

export { solanaSpokeIdl };
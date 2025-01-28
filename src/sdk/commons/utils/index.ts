export * from "./lut";
export * from "./pda";
export * from "./action-types";

import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, LAMPORTS_PER_SOL, Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getAccount, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, transferChecked } from "@solana/spl-token";
import { SolanaSpoke } from "../../../ts-types/solana/solana_spoke";
import { utils as coreUtils } from '@wormhole-foundation/sdk-solana-core';

export const WRAPPED_WETH_DECIMALS = 8;
export const AIRDROP_SOL_AMOUNT = 42 * LAMPORTS_PER_SOL;
export const USDC_DECIMALS = 6;
// Ethereum mainnet usdc address
export const ETHEREUM_USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
// Solana mainnet usdc mint address
export const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
// Solana devnet usdc mint address
export const USDC_MINT_ADDRESS_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export interface BaseConfigInit {
  hubChainId: number;
  hubAddress: number[];
  foreignWormholeTunnel: number[];
  foreignCustomWormholeRelayer: number[];
  relayerReward: anchor.BN;
  spokeReleaseFundsTxCostSol: anchor.BN;
  hubTxCostSol: anchor.BN;
  relayerAccount: PublicKey;
  relayerRewardAccount: PublicKey;
  relayerVault: PublicKey;
  priceKeeper: PublicKey;
}

export interface BaseConfigUpdate {
    foreignWormholeTunnel: number[] | null;
    foreignCustomWormholeRelayer: number[] | null;
    relayerReward: anchor.BN | null;
    relayerAccount: PublicKey | null;
    relayerRewardAccount: PublicKey | null;
    relayerVault: PublicKey | null;
    priceKeeper: PublicKey | null;
}

export type WormholePublishMessageAccounts = {
  wormholeBridge: PublicKey;
  wormholeEmitterSequence: PublicKey;
  wormholeFeeCollector: PublicKey;
  wormholeProgram: PublicKey;
};

export type WormholeLookupTableAccounts = WormholePublishMessageAccounts & {
  usdcMint: PublicKey;
  // programs
  tokenProgram: PublicKey;
  spokeProgramId: PublicKey;
  systemProgram: PublicKey;
  clock: PublicKey;
  rent: PublicKey;
};

export async function airdrop(connection: Connection, userPubkey: PublicKey) {
    const signature = await connection.requestAirdrop(userPubkey, AIRDROP_SOL_AMOUNT)
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
    });
}

export async function pauseSpoke(program: anchor.Program<SolanaSpoke>, ownerKeypair: Keypair) {
  await program.methods
    .pauseSpoke()
    .accounts({
      owner: ownerKeypair.publicKey
    })
    .signers([ownerKeypair])
    .rpc({ skipPreflight: true });
}

export async function unpauseSpoke(program: anchor.Program<SolanaSpoke>, ownerKeypair: Keypair) {
  await program.methods
    .unpauseSpoke()
    .accounts({
      owner: ownerKeypair.publicKey
    })
    .signers([ownerKeypair])
    .rpc({ skipPreflight: true });
}

export async function getTokenBridgeSequenceValue(
  connection: Connection,
  core_bridge_pid: PublicKey,
  token_bridge_pid: PublicKey
): Promise<bigint> {
  const sequenceTracker = await coreUtils.getProgramSequenceTracker(
    connection,
    token_bridge_pid,
    core_bridge_pid
  );
  // examples seems to be wrong, seq is increased after use not before: https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_message.rs#L242
  // example suggest using below value + 1, but to have the same value that Wormhole Message account
  // will have for sequence field we should not increment here.
  return sequenceTracker.sequence;
}

/**
 * This works because custom_wormhole_emitter account is created with wormhole standards seeds ["emitter"] + programId.
 * Which is equivalent to deriveWormholeEmitterKey() function   
 *   -> defined here: https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/solana/wormhole/accounts/emitter.ts#L19
 * Used inside getProgramSequenceTracker()
 *   -> defined here: https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/solana/wormhole/accounts/emitter.ts#L36
 */
export async function getCustomWormholeEmitterSequenceValue(
  connection: Connection,
  emitterProgramId: PublicKey,
  core_bridge_pid: PublicKey,
  customEmitterWormholeSequencePda: PublicKey
): Promise<bigint> {
  let sequence = 0n;
  // if this is first use than pda will not exist and seq value should be 0
  if ((await connection.getAccountInfo(customEmitterWormholeSequencePda)) != null ) { 
    const sequenceTracker = await coreUtils.getProgramSequenceTracker(
      connection,
      emitterProgramId,
      core_bridge_pid
    );
    sequence = sequenceTracker.sequence;
  }
  
  return sequence;
}

export async function getUserMessageNonceValue(
  connection: Connection,
  userMessageNoncePda: PublicKey
): Promise<bigint> {
    if ((await connection.getAccountInfo(userMessageNoncePda)) == null ) {
      // This is the first call contract function in which custom pda was not initialized yet.
      // We know it will start from 0, so we pass it as constant here
      return 0n;
    } else {
      // UserMessageNoncePda account already exist we can take value from it.
      // We can not use program.account.userMessageNonce.fetch(..) as Anchor did not generate such method
      // because in all instructions we are using UncheckedAccount<> when passing this account. 
      const accountInfo = await connection.getAccountInfo(userMessageNoncePda);
      const data = accountInfo!.data;
      const valueBuff = data.subarray(8, 16);
      const value = valueBuff.readBigInt64LE();

      return BigInt(value.toString());
    }
}

export function toBigInt(a: anchor.BN): bigint {
  return BigInt(a.toString());
}

export function toBN(a: bigint): BN {
  return new BN(a.toString());
}

export function convertUint8ArrayToBigInt(amountAsBytes: Uint8Array) {
  let paddedArray = new Uint8Array(8);
  paddedArray.set(amountAsBytes, 8 - amountAsBytes.length);
  const dataView = new DataView(paddedArray.buffer);
  const tunnelMessageAmount = dataView.getBigUint64(0); // get BE number starting at 0 index
  return tunnelMessageAmount;
}

export function evmToWormholeAddress(hexString: string): number[] {
  // Remove the '0x' prefix from the input string if it's present
  const cleanedHexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

  const buffer = Buffer.alloc(32);
  buffer.write(cleanedHexString, 32 - cleanedHexString.length / 2, "hex"); // each hex char is 2 bytes

  return Array.from(buffer);
}

export async function getTokenBalance(connection: Connection, tokenAccount: PublicKey): Promise<bigint> {
  return await getAccount(connection, tokenAccount).then((token) => token.amount);
}

export async function transferSol(connection: Connection, from: Keypair, to: Keypair, amountToKeep: number) {
  const tmpAccountBalance = await connection.getBalance(from.publicKey);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: tmpAccountBalance - amountToKeep,
    })
  );
  await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
}

export async function transferAllSplToken(
  connection: Connection, 
  tokenMint: PublicKey, 
  mintDecimals: number, 
  fromAccount: Keypair, 
  toAccount: Keypair,
  amountToKeep: bigint = 0n
) {
  const fromAta = await getOrCreateAssociatedTokenAccount(
    connection,
    fromAccount, // payer
    tokenMint,
    fromAccount.publicKey
  );
  const toAta = await getOrCreateAssociatedTokenAccount(
    connection,
    toAccount, // payer
    tokenMint,
    toAccount.publicKey
  );
  const fromAccountBalance =  await getTokenBalance(connection, fromAta.address);

  await transferChecked(
    connection, // connection
    fromAccount, // payer
    fromAta.address, // from (should be a token account)
    tokenMint, // mint
    toAta.address, // to (should be a token account)
    fromAccount, // from's owner
    fromAccountBalance - amountToKeep,
    mintDecimals // decimals
  );
}

// create account with given space and owner
export async function createAccount(
  connection: Connection,
  payer: Keypair,
  newAccount: Keypair,
  space: number,
  owner: PublicKey
) {
  try {
    // Calculate rent exemption amount for the specified space
    const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

    // Create account instruction
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: rentExemptionAmount,
      space: space,
      programId: owner  // This sets the account owner
    });

    // Create and sign transaction
    const transaction = new Transaction().add(createAccountInstruction);

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
      newAccount
    ]);

    return signature;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

/** Lookup table accounts **/
export function commonAccounts(
  programId: PublicKey,
  customEmitterPda: PublicKey,
  coreBridgePid: PublicKey,
  usdcMintAddress: PublicKey
): WormholeLookupTableAccounts {
  const wormholeAccounts = wormholePublishMessageAccounts(customEmitterPda, coreBridgePid);

  return {
    usdcMint: usdcMintAddress,
    // wormhole
    wormholeBridge: wormholeAccounts.wormholeBridge,
    wormholeEmitterSequence: wormholeAccounts.wormholeEmitterSequence,
    wormholeFeeCollector: wormholeAccounts.wormholeFeeCollector,
    wormholeProgram: coreBridgePid,
    // programs
    tokenProgram: TOKEN_PROGRAM_ID,
    spokeProgramId: programId,
    systemProgram: SystemProgram.programId,
    clock: SYSVAR_CLOCK_PUBKEY,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

function wormholePublishMessageAccounts(
  emitter: PublicKey,
  coreBridgePid: PublicKey
): WormholePublishMessageAccounts {
  return {
      wormholeBridge: PublicKey.findProgramAddressSync(
          [Buffer.from("Bridge")],
          coreBridgePid,
      )[0],
      wormholeEmitterSequence: PublicKey.findProgramAddressSync(
          [Buffer.from("Sequence"), emitter.toBuffer()],
          coreBridgePid,
      )[0],
      wormholeFeeCollector: PublicKey.findProgramAddressSync(
          [Buffer.from("fee_collector")],
          coreBridgePid,
      )[0],
      wormholeProgram: coreBridgePid
  };
}

export function jsonStringify(object: any): string {
  return JSON.stringify(object, null, 2)
}
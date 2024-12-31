import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { deriveAddress } from "@certusone/wormhole-sdk/lib/cjs/solana";
import { PublicKeyInitData } from "@solana/web3.js";

/**
 * This will generate pda for Message account that will be pass to the on-chain program and
 * to which our payload data will be written.
 * 
 * Note: use only for messages generated raw wormhole bridge (seeds are different !)
 * 
 * @param programId - program Id calling the token_bridge to transfer tokens
 * @param sequence - seq number for this message account
 * @returns - pda for Message account
 */
export function deriveWormholeCoreMessageKey(
  programId: PublicKeyInitData,
  sequence: bigint,
  signerKey: PublicKey
) {
  return deriveAddress(
    [
      Buffer.from("sent"),
      (() => {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64LE(sequence);
        return buf;
      })(),
      signerKey.toBuffer()
    ],
    programId
  );
}

/**
 * This will generate pda for Message account that will be pass to the on-chain program and
 * to which our transfer payload data will be written.
 * 
 * Note: use only for messages generated with token_bridge (seeds are different !)
 * 
 * @param programId - program Id calling the token_bridge to transfer tokens
 * @param sequence - seq number for this message account
 * @returns - pda for Message account
 */
export function deriveTokenBridgeMessageKey(
  programId: PublicKeyInitData,
  sequence: bigint,
  signerKey: PublicKey
) {
  return deriveAddress(
    [
      Buffer.from("bridged"),
      (() => {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64LE(sequence);
        return buf;
      })(),
      signerKey.toBuffer()
    ],
    programId
  );
}

export function deriveTmpAccountPda(mint: PublicKey, programId: PublicKey): PublicKey {
  const [tmpAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("tmp"), mint.toBuffer()],
    programId
  );
  return tmpAccountPda;
}

export function deriveCustomEmitterPda(programId: PublicKey): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("emitter")],
    programId
  );
  return pda;
}

export function deriveBaseConfigPda(programId: PublicKey): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("base_config")],
    programId
  );
  return pda;
}

export function deriveDeliveryPriceConfigPda(programId: PublicKey): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("delivery_price_config")],
    programId
  );
  return pda;
}

export function deriveVaultConfigPda(programId: PublicKey): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault_config")],
    programId
  );
  return pda;
}

export function deriveReservesConfigPda(programId: PublicKey): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("reserves_config")],
    programId
  );
  return pda;
}

export function deriveCustomEmitterWormholeSequencePda(
  wormholeProgramId: PublicKey,
  customEmitterPda: PublicKey
): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Sequence"), customEmitterPda.toBuffer() ],
    wormholeProgramId
  );
  return pda;
}

export function deriveConsumedVaaPda(programId: PublicKey, vaaAddress: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("consumed_vaa"), vaaAddress.toBuffer()],
      new PublicKey(programId),
  );
  return pda;
}

export function deriveConsumedNoncePda(programId: PublicKey, nonce: bigint, user: PublicKey): PublicKey {
  const nonce_bytes = Buffer.alloc(8);
  nonce_bytes.writeBigUInt64LE(nonce);
  const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("consumed_nonce"), nonce_bytes, user.toBuffer()],
      new PublicKey(programId),
  );
  return pda;
}

export function deriveUserMessageNoncePda(
  programId: PublicKey,
  user: PublicKey
): PublicKey {
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_message_nonce"), user.toBuffer() ],
    programId
  );
  return pda;
}
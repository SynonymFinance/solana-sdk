import * as anchor from "@coral-xyz/anchor";
import { AddressLookupTableAccount, AddressLookupTableProgram, ConfirmOptions, PublicKey, sendAndConfirmRawTransaction, TransactionInstruction, TransactionMessage, TransactionSignature, VersionedTransaction } from "@solana/web3.js";
import { WormholeLookupTableAccounts } from "./index";

export async function createLookupTable(provider: anchor.AnchorProvider): Promise<PublicKey> {
  // we use this trick to avoid error like : "79 is not a recent slot"
  // another option is to use: getSlot("finalized");
  const slot = await provider.connection.getSlot() - 1;

  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: provider.wallet.publicKey,
      payer: provider.wallet.publicKey,
      recentSlot: slot,
    });

  await sendTxWithConfirmation(provider, [lookupTableInst]);

  return lookupTableAddress;
}

export async function extendLookupTable(
  provider: anchor.AnchorProvider,
  lookupTableAddress: PublicKey,
  commonAccounts: WormholeLookupTableAccounts
) {

  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: provider.wallet.publicKey,
    authority: provider.wallet.publicKey,
    lookupTable: lookupTableAddress,
    addresses: Object.values(commonAccounts).filter((key) => key !== undefined),
  });

  await sendTxWithConfirmation(
    provider,
    [extendInstruction],
    undefined,
    // { commitment: "finalized" } // we could use this but to wait, but it takes too long
  );

  // NOTICE: 
  // Unfortunately, lookup tables are not active when initialized or extended until a new block is created.
  // If we don't wait fot extended LUT to "warm-up", we will get error: `Transaction address table lookup uses an invalid index`
  //
  // Blocks are created usually every 1 slot (but not always, if can happen that there are slots with not blocks produced)
  // In our test env we can either use commitment::finalized for about extend Tx (block get finalized after at least 32 slots)
  // or sleep for a short time to make a few slots pass (so next transaction is not is the same slot at extend LUT tx)
  // second option takes less time, so it was used here
  await sleep(500);
}

export function buildV0Transaction(
  signerPublicKey: PublicKey,
  instructions: TransactionInstruction[],
  latestBlockhash: string,
  addressLookupTableAccounts?: AddressLookupTableAccount[],
): VersionedTransaction {

  const messageV0 = new TransactionMessage({
    payerKey: signerPublicKey,
    recentBlockhash: latestBlockhash,
    instructions
  }).compileToV0Message(addressLookupTableAccounts);

  const tx = new VersionedTransaction(messageV0);
  return tx;
}

export async function sendTxWithConfirmation(
  provider: anchor.AnchorProvider,
  instructions: TransactionInstruction[],
  lookupTableAddress?: PublicKey,
  confirmOptions?: ConfirmOptions
): Promise<TransactionSignature> {

  let latestBlockhashData = await provider.connection.getLatestBlockhash();

  let lookupTableAccounts: AddressLookupTableAccount[] = [];
  if (lookupTableAddress != null) {
    const lookupTableAccount = await provider.connection
      .getAddressLookupTable(lookupTableAddress)
      .then((resp) => resp.value);
    if (lookupTableAccount === null) {
      throw new Error(`Lookup table account not found: ${lookupTableAddress.toBase58()}`);
    }
    lookupTableAccounts = [lookupTableAccount];
  }

  const txV0 = buildV0Transaction(provider.wallet.publicKey, instructions, latestBlockhashData.blockhash, lookupTableAccounts);

  // use wallet interface to sign the tx
  const signedTx = await provider.wallet.signTransaction(txV0);

  // if commitment is not defined use default "confirmed" commitment
  const commitment = confirmOptions === undefined ? "confirmed" : confirmOptions.commitment!;

  // will send tx and wait for confirmation
  const txSignature = await sendAndConfirmRawTransaction(
    provider.connection,
    Buffer.from(signedTx.serialize()),
    {
      commitment: commitment,
      preflightCommitment: commitment,
    }
  );

  return txSignature;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(
    (resolve) => setTimeout(resolve, ms));
}
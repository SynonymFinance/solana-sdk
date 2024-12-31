import { ethers } from 'ethers';

export const REQUEST_PAIRING_PAYLOAD_ABI_FORMAT = [
  "bytes32",   // newAccount
  "bytes32",   // userId
];

export class RequestPairingPayload {
  newAccount: Uint8Array; // bytes32
  userId: Uint8Array;     // bytes32

  constructor(
    user: Uint8Array,
    asset: Uint8Array,
  ) {
    this.newAccount = user;
    this.userId = asset;
  }

  public static from(
    data: { newAccount: Uint8Array, userId: Uint8Array }
  ): RequestPairingPayload {
    return new RequestPairingPayload(data.newAccount, data.userId);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.utils.defaultAbiCoder.encode(
      REQUEST_PAIRING_PAYLOAD_ABI_FORMAT,
      [
        this.newAccount,
        this.userId,
      ]
    );

    if (encodedMessage.startsWith('0x')) {
      encodedMessage = encodedMessage.slice(2);
    }

    return Buffer.from(encodedMessage, "hex");
  }

  public static decode(encodedMessage: Buffer): RequestPairingPayload {
    let hexString = encodedMessage.toString("hex");
    if (!hexString.startsWith('0x')) {
      hexString = "0x" + hexString;
    }
    const decodedArray = ethers.utils.defaultAbiCoder.decode(
      REQUEST_PAIRING_PAYLOAD_ABI_FORMAT,
      hexString
    );

    const newAccount = ethers.utils.arrayify(decodedArray[0]);                               
    const userId = ethers.utils.arrayify(decodedArray[1]);        

    const decodedMessage = new RequestPairingPayload(
      newAccount,
      userId,
    );

    return decodedMessage;
  }
}

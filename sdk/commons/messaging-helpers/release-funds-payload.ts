import { ethers } from 'ethers';

export const RELEASE_FUNDS_PAYLOAD_ABI_FORMAT = [
  "bytes32",   // user
  "bytes32",   // token
  "uint256",   // amount
  "uint256",   // nonce
  "uint8",     // unwrapWeth
];

export class ReleaseFundsPayload {
  user: Uint8Array;             // bytes32
  token: Uint8Array;            // bytes32
  amount: Uint8Array;           // uint256
  nonce: Uint8Array;            // uint256
  unwrapWeth: boolean;          // uint8

  constructor(
    user: Uint8Array,
    token: Uint8Array,
    amount: ethers.BigNumber,
    nonce: ethers.BigNumber,
    unwrapWeth: boolean,
  ) {
    this.user = user;
    this.token = token;
    this.amount = ethers.utils.arrayify(amount);
    this.nonce = ethers.utils.arrayify(nonce);
    this.unwrapWeth = unwrapWeth;
  }

  public static from(
    data: { 
      user: Uint8Array,
      token: Uint8Array,
      amount: ethers.BigNumber,
      nonce: ethers.BigNumber,
      unwrapWeth: boolean,
    }
  ): ReleaseFundsPayload {
    return new ReleaseFundsPayload(data.user, data.token, data.amount, data.nonce, data.unwrapWeth);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.utils.defaultAbiCoder.encode(
      RELEASE_FUNDS_PAYLOAD_ABI_FORMAT,
      [
        this.user,
        this.token,
        this.amount,
        this.nonce,
        Number(this.unwrapWeth)
      ]
    );

    if (encodedMessage.startsWith('0x')) {
      encodedMessage = encodedMessage.slice(2);
    }

    return Buffer.from(encodedMessage, "hex");
  }

  public static decode(encodedMessage: Buffer): ReleaseFundsPayload {
    let hexString = encodedMessage.toString("hex");
    if (!hexString.startsWith('0x')) {
      hexString = "0x" + hexString;
    }
    const decodedArray = ethers.utils.defaultAbiCoder.decode(
      RELEASE_FUNDS_PAYLOAD_ABI_FORMAT,
      hexString
    );

    const user = ethers.utils.arrayify(decodedArray[0]);                               
    const token = ethers.utils.arrayify(decodedArray[1]);        
    const amount = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[2]));        
    const nonce = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[3]));        
    const unwrapWeth = Boolean(decodedArray[4]);

    const decodedMessage = new ReleaseFundsPayload(
      user,
      token,
      amount,
      nonce,
      unwrapWeth
    );

    return decodedMessage;
  }
}

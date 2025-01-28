import { ethers } from 'ethers';

export const INSTANT_ACTION_PAYLOAD_ABI_FORMAT = [
  "bytes32",   // user
  "uint8",     // action
  "bytes32",   // token
  "uint256",   // amount
  "uint256",   // nonce
  "uint256",   // spoke deposits
];

export class InstantActionPayload {
  user: Uint8Array;             // bytes32
  action: number;               // uint8
  token: Uint8Array;            // bytes32
  amount: Uint8Array;           // uint256
  nonce: Uint8Array;            // uint256
  spokeDeposits: Uint8Array;    // uint256

  constructor(
    user: Uint8Array,
    action: number,
    token: Uint8Array,
    amount: bigint,
    nonce: bigint,
    spokeDeposits: bigint,
  ) {
    this.user = user;
    this.action = action;
    this.token = token;
    this.amount = ethers.toBeArray(amount);
    this.nonce = ethers.toBeArray(nonce);
    this.spokeDeposits = ethers.toBeArray(spokeDeposits);
  }

  public static from(
    data: { 
      user: Uint8Array,
      action: number,
      token: Uint8Array,
      amount: bigint,
      nonce: bigint,
      spokeDeposits: bigint,
    }
  ): InstantActionPayload {
    return new InstantActionPayload(data.user, data.action, data.token, data.amount, data.nonce, data.spokeDeposits);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.AbiCoder.defaultAbiCoder().encode(
      INSTANT_ACTION_PAYLOAD_ABI_FORMAT,
      [
        this.user,
        this.action,
        this.token,
        this.amount,
        this.nonce,
        this.spokeDeposits
      ]
    );

    if (encodedMessage.startsWith('0x')) {
      encodedMessage = encodedMessage.slice(2);
    }

    return Buffer.from(encodedMessage, "hex");
  }

  public static decode(encodedMessage: Buffer): InstantActionPayload {
    let hexString = encodedMessage.toString("hex");
    if (!hexString.startsWith('0x')) {
      hexString = "0x" + hexString;
    }
    const decodedArray = ethers.AbiCoder.defaultAbiCoder().decode(
      INSTANT_ACTION_PAYLOAD_ABI_FORMAT,
      hexString
    );

    // --> ethers v5 version left for reference if something would not work
    // const user = ethers.utils.arrayify(decodedArray[0]);                               
    // const action = decodedArray[1];                               
    // const token = ethers.utils.arrayify(decodedArray[2]);        
    // const amount = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[3]));        
    // const nonce = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[4]));        
    // const spokeDeposits = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[5])); 
    
    const user: Uint8Array = ethers.getBytes(decodedArray[0]);
    const action: number = decodedArray[1];
    const token: Uint8Array = ethers.getBytes(decodedArray[2]);
    const amount: bigint = BigInt(decodedArray[3]);
    const nonce: bigint = BigInt(decodedArray[4]);
    const spokeDeposits: bigint = BigInt(decodedArray[5]);

    const decodedMessage = new InstantActionPayload(
      user,
      action,
      token,
      amount,
      nonce,
      spokeDeposits
    );

    return decodedMessage;
  }
}

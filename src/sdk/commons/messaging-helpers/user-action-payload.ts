import { ethers } from 'ethers';

export const USER_ACTION_PAYLOAD_ABI_FORMAT = [
  "bytes32",   // user
  "uint8",     // action
  "bytes32",   // asset
  "uint256",   // amount
];

export class UserActionPayload {
  user: Uint8Array;      // bytes32
  action: number;        // uint8
  asset: Uint8Array;     // bytes32
  amount: Uint8Array;    // uint256

  constructor(
    user: Uint8Array,
    action: number,
    asset: Uint8Array,
    amount: bigint,
  ) {
    this.user = user;
    this.action = action;
    this.asset = asset;
    this.amount = ethers.toBeArray(amount);
  }

  public static from(
    data: { user: Uint8Array, action: number, asset: Uint8Array, amount: bigint }
  ): UserActionPayload {
    return new UserActionPayload(data.user, data.action, data.asset, data.amount);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.AbiCoder.defaultAbiCoder().encode(
      USER_ACTION_PAYLOAD_ABI_FORMAT,
      [
        this.user,
        this.action,
        this.asset,
        this.amount,
      ]
    );

    if (encodedMessage.startsWith('0x')) {
      encodedMessage = encodedMessage.slice(2);
    }
    // UAP struct is now simpler - it does not contain inner struct with variable length payload (target.payload of type bytes)
    // thanks to this we no longer need to add a startOffset field at start

    return Buffer.from(encodedMessage, "hex");
  }

  public static decode(encodedMessage: Buffer): UserActionPayload {
    let hexString = encodedMessage.toString("hex");
    if (!hexString.startsWith('0x')) {
      hexString = "0x" + hexString;
    }
    const decodedArray = ethers.AbiCoder.defaultAbiCoder().decode(
      USER_ACTION_PAYLOAD_ABI_FORMAT,
      hexString
    );

    // --> ethers v5 version for reference
    // const user = ethers.utils.arrayify(decodedArray[0]);                               
    // const action = decodedArray[1];                               
    // const asset = ethers.utils.arrayify(decodedArray[2]);        
    // const amount = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[3]));        

    const user: Uint8Array = ethers.getBytes(decodedArray[0]);
    const action: number = decodedArray[1];
    const asset: Uint8Array = ethers.getBytes(decodedArray[2]);
    const amount: bigint = BigInt(decodedArray[3]);

    const decodedMessage = new UserActionPayload(
      user,
      action,
      asset,
      amount,
    );

    return decodedMessage;
  }
}

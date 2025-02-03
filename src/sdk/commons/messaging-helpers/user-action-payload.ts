import { ethers } from 'ethers';

export const USER_ACTION_PAYLOAD_ABI_FORMAT = [
  "bytes32",   // user
  "uint8",     // action
  "bytes32",   // token
  "uint256",   // amount
  "uint256",   // nonce
];

export class UserActionPayload {
  user: Uint8Array;      // bytes32
  action: number;        // uint8
  token: Uint8Array;     // bytes32
  amount: Uint8Array;    // uint256
  nonce: Uint8Array;    // uint256

  constructor(
    user: Uint8Array,
    action: number,
    token: Uint8Array,
    amount: ethers.BigNumber,
    nonce: ethers.BigNumber,
  ) {
    this.user = user;
    this.action = action;
    this.token = token;
    this.amount = ethers.utils.arrayify(amount);
    this.nonce = ethers.utils.arrayify(nonce);
  }

  public static from(
    data: { user: Uint8Array, action: number, token: Uint8Array, amount: ethers.BigNumber, nonce: ethers.BigNumber }
  ): UserActionPayload {
    return new UserActionPayload(data.user, data.action, data.token, data.amount, data.nonce);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.utils.defaultAbiCoder.encode(
      USER_ACTION_PAYLOAD_ABI_FORMAT,
      [
        this.user,
        this.action,
        this.token,
        this.amount,
        this.nonce,
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
    const decodedArray = ethers.utils.defaultAbiCoder.decode(
      USER_ACTION_PAYLOAD_ABI_FORMAT,
      hexString
    );

    const user = ethers.utils.arrayify(decodedArray[0]);
    const action = decodedArray[1];
    const token = ethers.utils.arrayify(decodedArray[2]);
    const amount = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[3]));
    const nonce = ethers.BigNumber.from(ethers.utils.arrayify(decodedArray[4]));

    const decodedMessage = new UserActionPayload(
      user,
      action,
      token,
      amount,
      nonce
    );

    return decodedMessage;
  }
}

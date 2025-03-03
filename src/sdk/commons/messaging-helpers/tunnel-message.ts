import { ethers } from 'ethers';
import { MessageSource } from './message-source';
import { MessageTarget } from './message-target';

const START_OFFSET_STR = "0000000000000000000000000000000000000000000000000000000000000020"; //"0x20" = 32

export const MESSAGE_TUNNEL_ABI_FORMAT = [
  "tuple(uint16 chainId, bytes32 sender, bytes32 refundRecipient)",
  "tuple(uint16 chainId, bytes32 recipient, bytes4 selector, bytes payload)",
  "bytes32",
  "uint256",
  "uint256",
  "uint8"
];

// Evm function selector for `IHub.userActionMessage.selector`
// Selector for: function userActionMessage(tuple(uint16 chainId, bytes32 sender, bytes32 refundRecipient), address, uint256, bytes)
export const USER_ACTION_MESSAGE_EVM_SELECTOR = Buffer.from("144f65c5", "hex");
// Evm function selector for `IHub.pairingRequestMessage.selector`
// Selector for: function pairingRequestMessage(tuple(uint16, bytes32, bytes32), address, uint256, bytes)
export const PAIRING_REQUEST_MESSAGE_EVM_SELECTOR = Buffer.from("f3c93275", "hex");
// Evm function selector for `IHub.instantActionMessage.selector`
export const INSTANT_ACTION_MESSAGE_EVM_SELECTOR = Buffer.from("d9a55f5c", "hex");

export class TunnelMessage {
  source: MessageSource;
  token: Uint8Array;
  amount: Uint8Array;
  receiverValue: Uint8Array;
  finality: MessageFinality;
  target: MessageTarget;

  constructor(
    source: MessageSource,
    target: MessageTarget,
    token: Uint8Array,
    amount: bigint,
    receiverValue: Uint8Array,
    finality: MessageFinality,
  ) {
    this.source = source;
    this.target = target;
    this.token = token;
    this.amount = ethers.getBytes(ethers.toBeHex(amount));
    this.receiverValue = receiverValue;
    this.finality = finality;
  }

  public static from(
    data: { source: MessageSource; target: MessageTarget; token: Uint8Array; amount: bigint; receiverValue: bigint; finality: number; }
  ): TunnelMessage {
    const source = data.source;
    const target = data.target;
    const token = data.token;
    const amount = data.amount;
    const receiverValue = ethers.toBeArray(data.receiverValue);
    const finality = data.finality;

    return new TunnelMessage(source, target, token, amount, receiverValue, finality);
  }

  public encode(): Buffer {
    let encodedMessage = ethers.AbiCoder.defaultAbiCoder().encode(
      MESSAGE_TUNNEL_ABI_FORMAT,
      [
        [this.source.chainId, this.source.sender, this.source.refundRecipient],
        [this.target.chainId, this.target.recipient, this.target.selector, this.target.payload],
        this.token,
        this.amount,
        this.receiverValue,
        this.finality
      ]
    );

    if (encodedMessage.startsWith('0x')) {
      encodedMessage = encodedMessage.slice(2);
    }
    // This is the hack we have to do due to some specifics of ABI encoding which for TunnelMessage appends
    // startOffset but it does not modify the offset to TunnelMessage.target 
    // (which is 0x100 it seems to be relative in TunnelMessage and does not care about "startOffset" filed)
    const startOffset = Buffer.alloc(32, START_OFFSET_STR, "hex");
    const encodedMessageBuf = Buffer.from(encodedMessage, "hex");
    const encodedMessageWithOffset = Buffer.concat([startOffset, encodedMessageBuf]);

    return encodedMessageWithOffset;
  }

  public static decode(encodedMessage: Buffer): TunnelMessage {
    // This is the hack we have to do due to some specifics of ABI encoding which for TunnelMessage appends
    // startOffset but it does not modify the offset to TunnelMessage.target 
    // (which is 0x100 it seems to be relative in TunnelMessage and does not care about "startOffset" filed)
    const encodedMessageWithoutOffset = encodedMessage.subarray(32);

    let hexString = encodedMessageWithoutOffset.toString("hex");
    if (!hexString.startsWith('0x')) {
      hexString = "0x" + hexString;
    }

    const decodedArray = ethers.AbiCoder.defaultAbiCoder().decode(
      MESSAGE_TUNNEL_ABI_FORMAT,
      hexString
    );

    const source = new MessageSource(  // tuple(uint16 chainId, bytes32 sender, bytes32 refundRecipient)
      decodedArray[0].chainId,                        
      ethers.getBytes(decodedArray[0].sender), 
      ethers.getBytes(decodedArray[0].refundRecipient)
    )
    const target = new MessageTarget( // tuple(uint16 chainId, bytes32 recipient, bytes4 selector, bytes payload)
      decodedArray[1].chainId,
      ethers.getBytes(decodedArray[1].recipient),
      ethers.getBytes(decodedArray[1].selector),
      ethers.getBytes(decodedArray[1].payload)
    );

    const token: Uint8Array = ethers.getBytes(decodedArray[2]);         // bytes32 token
    const amount: bigint = BigInt(decodedArray[3]);                     // uint256 amount
    const receiverValue: Uint8Array = ethers.getBytes(decodedArray[4]); // uint256 receiverValue
    const finality: MessageFinality = decodedArray[5];                  // uint8 finality

    const decodedMessage = new TunnelMessage(
      source,
      target,
      token,
      amount,
      receiverValue,
      finality,
    );

    return decodedMessage;
  }
}

export enum MessageFinality {
  Finalized,
  Safe,
  Instant
}
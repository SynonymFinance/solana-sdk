import {
  encodeUint8,
  decodeUint8,
  encodeUint16,
  decodeUint16,
  encodeBytes,
  decodeBytes,
  concatUint8Arrays
} from "./delivery-instruction-utils";

import { MessageKey } from "./message-key";

export class DeliveryInstruction {
  targetChain: number;
  targetAddress: Uint8Array;
  payload: Uint8Array;
  relayerAddress: Uint8Array;
  senderAddress: Uint8Array;
  messageKeys: MessageKey[];

  constructor(
    targetChain: number,
    targetAddress: Uint8Array,
    payload: Uint8Array,
    relayerAddress: Uint8Array,
    senderAddress: Uint8Array,
    messageKeys: MessageKey[]
  ) {
    this.targetChain = targetChain;
    this.targetAddress = targetAddress;
    this.payload = payload;
    this.relayerAddress = relayerAddress;
    this.senderAddress = senderAddress;
    this.messageKeys = messageKeys;
  }

  encode(): Uint8Array {
    const payloadId = encodeUint8(1);
    const targetChain = encodeUint16(this.targetChain);
    const targetAddress = this.targetAddress;
    const payload = encodeBytes(this.payload);
    const relayerAddress = this.relayerAddress;
    const senderAddress = this.senderAddress;
    const messageKeys = this.encodeMessageKeys(this.messageKeys);

    return concatUint8Arrays([payloadId, targetChain, targetAddress, payload, relayerAddress, senderAddress, messageKeys]);
  }

  static decode(data: Uint8Array): DeliveryInstruction {
    if (data[0] !== 1) {
      throw new Error("Invalid payload ID");
    }

    let offset = 1;
    let targetChain: number;
    [targetChain, offset] = decodeUint16(data, offset);

    const targetAddress = data.slice(offset, offset + 32);
    offset += 32;

    let payload: Uint8Array;
    [payload, offset] = decodeBytes(data, offset);

    const relayerAddress = data.slice(offset, offset + 32);
    offset += 32;

    const senderAddress = data.slice(offset, offset + 32);
    offset += 32;

    let messageKeys: MessageKey[];
    [messageKeys, offset] = DeliveryInstruction.decodeMessageKeys(data, offset);

    return new DeliveryInstruction(targetChain, targetAddress, payload, relayerAddress, senderAddress, messageKeys);
  }

  private encodeMessageKeys(messageKeys: MessageKey[]): Uint8Array {
    if (messageKeys.length > 255) {
      throw new Error("Too many message keys");
    }

    const length = encodeUint8(messageKeys.length);
    const keys = messageKeys.map(key => key.encode());
    return concatUint8Arrays([length, ...keys]);
  }

  private static decodeMessageKeys(data: Uint8Array, offset: number): [MessageKey[], number] {
    let length: number;
    [length, offset] = decodeUint8(data, offset);

    const keys: MessageKey[] = [];
    for (let i = 0; i < length; i++) {
      let key: MessageKey;
      [key, offset] = MessageKey.decode(data, offset);
      keys.push(key);
    }

    return [keys, offset];
  }
}
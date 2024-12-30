import {
  encodeUint8,
  decodeUint8,
  encodeBytes,
  decodeBytes,
  concatUint8Arrays
} from "./delivery-instruction-utils";
import { VaaKey } from "./vaa-key";


export class MessageKey {
  keyType: number;
  encodedKey: Uint8Array;

  public static readonly VAA_KEY_TYPE: number = 1;

  constructor(
    keyType: number,
    encodedKey: Uint8Array
  ) {
    this.keyType = keyType;
    this.encodedKey = encodedKey;
  }

  encode(): Uint8Array {
    const keyType = encodeUint8(this.keyType);
    if (this.keyType === MessageKey.VAA_KEY_TYPE) {
      return concatUint8Arrays([keyType, this.encodedKey]);
    } else {
      return concatUint8Arrays([keyType, encodeBytes(this.encodedKey)]);
    }
  }

  static decode(data: Uint8Array, offset: number): [MessageKey, number] {
    let keyType: number;
    [keyType, offset] = decodeUint8(data, offset);

    let encodedKey: Uint8Array;
    if (keyType === MessageKey.VAA_KEY_TYPE) {
      encodedKey = data.slice(offset, offset + VaaKey.LENGTH);
      offset += VaaKey.LENGTH;
    } else {
      [encodedKey, offset] = decodeBytes(data, offset);
    }

    return [new MessageKey(keyType, encodedKey), offset];
  }
}
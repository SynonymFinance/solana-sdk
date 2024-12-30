import {
  encodeUint16,
  encodeUint64,
  decodeUint16,
  decodeUint64,
  concatUint8Arrays
} from "./delivery-instruction-utils";
import { MessageKey } from "./message-key";


export class VaaKey {
  chainId: number;             // u16
  emitterAddress: Uint8Array;  // 32 bytes address
  sequence: bigint;            // u64

  public static readonly LENGTH: number = 2 + 32 + 8;

  constructor(
    chainId: number,
    emitterAddress: Uint8Array,
    sequence: bigint
  ) {
    this.chainId = chainId;
    this.emitterAddress = emitterAddress;
    this.sequence = sequence
  }

  static encode(vaaKey: VaaKey): Uint8Array {
    return concatUint8Arrays([
      encodeUint16(vaaKey.chainId),
      vaaKey.emitterAddress,
      encodeUint64(vaaKey.sequence)
    ]);
  }

  static decode(data: Uint8Array): VaaKey {
    let offset = 0;
    let chainId: number;
    [chainId, offset] = decodeUint16(data, offset);

    const emitterAddress = data.slice(offset, offset + 32);
    offset += 32;

    let sequence: bigint;
    [sequence, offset] = decodeUint64(data, offset);

    return new VaaKey(chainId, emitterAddress, sequence);
  }

  static vaaKeyArrayToMessageKeyArray(vaaKeys: VaaKey[]): MessageKey[] {
    return vaaKeys.map(vaaKey => {
      return new MessageKey(MessageKey.VAA_KEY_TYPE, VaaKey.encode(vaaKey));
    });
  }

  static messageKeyArrayToVaaKeyArray(messageKeys: MessageKey[]): VaaKey[] {
    const vaaKeys: VaaKey[] = [];

    for (const mk of messageKeys) {
      if (mk.keyType === MessageKey.VAA_KEY_TYPE) {
        vaaKeys.push(VaaKey.decode(mk.encodedKey));
      }
    }

    return vaaKeys;
  }
}
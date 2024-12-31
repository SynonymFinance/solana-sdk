
export function encodeUint8(value: number): Uint8Array {
  const buffer = new ArrayBuffer(1);
  new DataView(buffer).setUint8(0, value);
  return new Uint8Array(buffer);
}

export function decodeUint8(data: Uint8Array, offset: number): [number, number] {
  const value = new DataView(data.buffer, data.byteOffset + offset, 1).getUint8(0);
  return [value, offset + 1];
}

export function encodeUint16(value: number): Uint8Array {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setUint16(0, value, false);
  return new Uint8Array(buffer);
}

export function encodeUint64(value: bigint): Uint8Array {
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setBigUint64(0, value, false);
  return new Uint8Array(buffer);
}

export function decodeUint16(data: Uint8Array, offset: number): [number, number] {
  const value = new DataView(data.buffer, data.byteOffset + offset, 2).getUint16(0, false);
  return [value, offset + 2];
}

export function decodeUint64(data: Uint8Array, offset: number): [bigint, number] {
  const value = new DataView(data.buffer, data.byteOffset + offset, 8).getBigUint64(0, false);
  return [value, offset + 8];
}

export function encodeBytes(data: Uint8Array): Uint8Array {
  const length = encodeUint32(data.length);
  return new Uint8Array([...length, ...data]);
}

export function decodeBytes(data: Uint8Array, offset: number): [Uint8Array, number] {
  const [length, newOffset] = decodeUint32(data, offset);
  const value = data.slice(newOffset, newOffset + length);
  return [value, newOffset + length];
}

export function encodeUint32(value: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, value, false);
  return new Uint8Array(buffer);
}

export function decodeUint32(data: Uint8Array, offset: number): [number, number] {
  const value = new DataView(data.buffer, data.byteOffset + offset, 4).getUint32(0, false);
  return [value, offset + 4];
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}
export class MessageTarget {
  chainId: number;
  recipient: Uint8Array;
  selector: Uint8Array;
  payload: Uint8Array;

  constructor(chainId: number, recipient: Uint8Array, selector: Uint8Array, payload: Uint8Array) {
    this.chainId = chainId;
    this.recipient = recipient;
    this.selector = selector;
    this.payload = payload;
  }
}
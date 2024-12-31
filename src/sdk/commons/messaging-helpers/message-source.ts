export class MessageSource {
  chainId: number;
  sender: Uint8Array;
  refundRecipient: Uint8Array;

  constructor(chainId: number, sender: Uint8Array, refundRecipient: Uint8Array) {
    this.chainId = chainId;
    this.sender = sender;
    this.refundRecipient = refundRecipient;
  }
}
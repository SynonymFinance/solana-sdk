export interface GuardianSignature {
    index: number;
    signature: Buffer;
  }
  
  export interface ParsedVaa {
    version: number;
    guardianSetIndex: number;
    guardianSignatures: GuardianSignature[];
    timestamp: number;
    nonce: number;
    emitterChain: number;
    emitterAddress: Buffer;
    sequence: bigint;
    consistencyLevel: number;
    payload: Buffer;
    hash: Buffer;
  }
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_spoke.json`.
 */
export type SolanaSpoke = {
  "address": "Xaccm6FSksvhANYRnk8yF7hsTfJFzgrXwAbQ18K2ipK",
  "metadata": {
    "name": "solanaSpoke",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Synonym finance - Solana spoke"
  },
  "instructions": [
    {
      "name": "acceptOwnership",
      "discriminator": [
        172,
        23,
        43,
        13,
        238,
        213,
        85,
        150
      ],
      "accounts": [
        {
          "name": "userB",
          "signer": true
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "borrow",
      "docs": [
        "This function is used to initiate borrow of regular spl tokens (eg.: WSOL, WIF) or native SOL.",
        "",
        "# Arguments",
        "",
        "* `ctx` - accounts associated with this instruction",
        "* `amount` - The amount of native tokens to repay"
      ],
      "discriminator": [
        228,
        253,
        131,
        202,
        207,
        116,
        89,
        18
      ],
      "accounts": [
        {
          "name": "generic",
          "accounts": [
            {
              "name": "sender",
              "writable": true,
              "signer": true
            },
            {
              "name": "baseConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      98,
                      97,
                      115,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "vaultConfig",
              "docs": [
                "Needs to be mut as it stores SOL"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      118,
                      97,
                      117,
                      108,
                      116,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "deliveryPriceConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      100,
                      101,
                      108,
                      105,
                      118,
                      101,
                      114,
                      121,
                      95,
                      112,
                      114,
                      105,
                      99,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "relayerVault",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "relayerRewardAccount",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "mint",
              "docs": [
                "This is the token that user will deposit/borrow"
              ]
            },
            {
              "name": "vaultTokenAccount",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "account",
                    "path": "vaultConfig"
                  },
                  {
                    "kind": "const",
                    "value": [
                      6,
                      221,
                      246,
                      225,
                      215,
                      101,
                      161,
                      147,
                      217,
                      203,
                      225,
                      70,
                      206,
                      235,
                      121,
                      172,
                      28,
                      180,
                      133,
                      237,
                      95,
                      91,
                      55,
                      145,
                      58,
                      140,
                      245,
                      133,
                      126,
                      255,
                      0,
                      169
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "mint"
                  }
                ],
                "program": {
                  "kind": "const",
                  "value": [
                    140,
                    151,
                    37,
                    143,
                    78,
                    36,
                    137,
                    241,
                    187,
                    61,
                    16,
                    41,
                    20,
                    142,
                    13,
                    131,
                    11,
                    90,
                    19,
                    153,
                    218,
                    255,
                    16,
                    132,
                    4,
                    142,
                    123,
                    216,
                    219,
                    233,
                    248,
                    89
                  ]
                }
              }
            },
            {
              "name": "wormholeBridge",
              "docs": [
                "Wormhole bridge data. Mutable."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      66,
                      114,
                      105,
                      100,
                      103,
                      101
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeFeeCollector",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      102,
                      101,
                      101,
                      95,
                      99,
                      111,
                      108,
                      108,
                      101,
                      99,
                      116,
                      111,
                      114
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "customWormholeEmitter",
              "docs": [
                "This is our custom emitter account that will be used to send raw payload across wormhole core bridge"
              ],
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      101,
                      109,
                      105,
                      116,
                      116,
                      101,
                      114
                    ]
                  }
                ]
              }
            },
            {
              "name": "userMessageNonce",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      117,
                      115,
                      101,
                      114,
                      95,
                      109,
                      101,
                      115,
                      115,
                      97,
                      103,
                      101,
                      95,
                      110,
                      111,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "customEmitterWormholeSequence",
              "docs": [
                "This is not created until the first message is posted, so it needs to be an [UncheckedAccount]",
                "for wormhole_program (core bridge) to be able to create it. [`wormhole::post_message`] requires this account be mutable.",
                "Notice: this account belongs to wormhole_program who will increment seq for it",
                "and will use to generate seq number for a message (not signed VAA)"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      83,
                      101,
                      113,
                      117,
                      101,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "customWormholeEmitter"
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeMessage",
              "docs": [
                "",
                "Note: Must be our program PDA as this account is required to be CPI call signer.",
                "Note: As seed sequence we are passing `user_message_nonce.value`.",
                "It ensures that there will never be two messages with the same address at any point in time.",
                "Because each message has user/sender.key() and user nonce in seed which makes it unique.",
                "This prevents conflicts between transactions using the same `wormhole_message` account addresses."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      115,
                      101,
                      110,
                      116
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "user_message_nonce.value",
                    "account": "userMessageNonce"
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "wormholeProgram",
              "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            },
            {
              "name": "tokenProgram",
              "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
              "name": "associatedTokenProgram",
              "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            },
            {
              "name": "clock",
              "address": "SysvarC1ock11111111111111111111111111111111"
            },
            {
              "name": "rent",
              "address": "SysvarRent111111111111111111111111111111111"
            }
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "docs": [
        "This function is used to deposit regular spl tokens (eg.: JitoSOL, USDC) or native SOL",
        "",
        "# Arguments",
        "",
        "* `ctx` - accounts associated with this instruction",
        "* `amount` - The amount of native tokens to deposit as collateral."
      ],
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "generic",
          "accounts": [
            {
              "name": "sender",
              "writable": true,
              "signer": true
            },
            {
              "name": "baseConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      98,
                      97,
                      115,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "vaultConfig",
              "docs": [
                "Needs to be mut as it stores SOL"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      118,
                      97,
                      117,
                      108,
                      116,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "deliveryPriceConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      100,
                      101,
                      108,
                      105,
                      118,
                      101,
                      114,
                      121,
                      95,
                      112,
                      114,
                      105,
                      99,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "relayerVault",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "relayerRewardAccount",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "mint",
              "docs": [
                "This is the token that user will deposit/borrow"
              ]
            },
            {
              "name": "vaultTokenAccount",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "account",
                    "path": "vaultConfig"
                  },
                  {
                    "kind": "const",
                    "value": [
                      6,
                      221,
                      246,
                      225,
                      215,
                      101,
                      161,
                      147,
                      217,
                      203,
                      225,
                      70,
                      206,
                      235,
                      121,
                      172,
                      28,
                      180,
                      133,
                      237,
                      95,
                      91,
                      55,
                      145,
                      58,
                      140,
                      245,
                      133,
                      126,
                      255,
                      0,
                      169
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "mint"
                  }
                ],
                "program": {
                  "kind": "const",
                  "value": [
                    140,
                    151,
                    37,
                    143,
                    78,
                    36,
                    137,
                    241,
                    187,
                    61,
                    16,
                    41,
                    20,
                    142,
                    13,
                    131,
                    11,
                    90,
                    19,
                    153,
                    218,
                    255,
                    16,
                    132,
                    4,
                    142,
                    123,
                    216,
                    219,
                    233,
                    248,
                    89
                  ]
                }
              }
            },
            {
              "name": "wormholeBridge",
              "docs": [
                "Wormhole bridge data. Mutable."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      66,
                      114,
                      105,
                      100,
                      103,
                      101
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeFeeCollector",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      102,
                      101,
                      101,
                      95,
                      99,
                      111,
                      108,
                      108,
                      101,
                      99,
                      116,
                      111,
                      114
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "customWormholeEmitter",
              "docs": [
                "This is our custom emitter account that will be used to send raw payload across wormhole core bridge"
              ],
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      101,
                      109,
                      105,
                      116,
                      116,
                      101,
                      114
                    ]
                  }
                ]
              }
            },
            {
              "name": "userMessageNonce",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      117,
                      115,
                      101,
                      114,
                      95,
                      109,
                      101,
                      115,
                      115,
                      97,
                      103,
                      101,
                      95,
                      110,
                      111,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "customEmitterWormholeSequence",
              "docs": [
                "This is not created until the first message is posted, so it needs to be an [UncheckedAccount]",
                "for wormhole_program (core bridge) to be able to create it. [`wormhole::post_message`] requires this account be mutable.",
                "Notice: this account belongs to wormhole_program who will increment seq for it",
                "and will use to generate seq number for a message (not signed VAA)"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      83,
                      101,
                      113,
                      117,
                      101,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "customWormholeEmitter"
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeMessage",
              "docs": [
                "",
                "Note: Must be our program PDA as this account is required to be CPI call signer.",
                "Note: As seed sequence we are passing `user_message_nonce.value`.",
                "It ensures that there will never be two messages with the same address at any point in time.",
                "Because each message has user/sender.key() and user nonce in seed which makes it unique.",
                "This prevents conflicts between transactions using the same `wormhole_message` account addresses."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      115,
                      101,
                      110,
                      116
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "user_message_nonce.value",
                    "account": "userMessageNonce"
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "wormholeProgram",
              "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            },
            {
              "name": "tokenProgram",
              "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
              "name": "associatedTokenProgram",
              "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            },
            {
              "name": "clock",
              "address": "SysvarC1ock11111111111111111111111111111111"
            },
            {
              "name": "rent",
              "address": "SysvarRent111111111111111111111111111111111"
            }
          ]
        },
        {
          "name": "senderTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "generic.sender",
                "account": "genericSendMessage"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "generic.mint",
                "account": "genericSendMessage"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "deliveryPriceConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  105,
                  118,
                  101,
                  114,
                  121,
                  95,
                  112,
                  114,
                  105,
                  99,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vaultConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "init",
          "type": {
            "defined": {
              "name": "baseConfigInitWrapper"
            }
          }
        }
      ]
    },
    {
      "name": "pairAccount",
      "docs": [
        "This will send a Vaa with paring request to Hub.",
        "We request pairing sender account with given user_id"
      ],
      "discriminator": [
        23,
        0,
        53,
        182,
        148,
        202,
        210,
        112
      ],
      "accounts": [
        {
          "name": "generic",
          "accounts": [
            {
              "name": "sender",
              "writable": true,
              "signer": true
            },
            {
              "name": "baseConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      98,
                      97,
                      115,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "vaultConfig",
              "docs": [
                "Needs to be mut as it stores SOL"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      118,
                      97,
                      117,
                      108,
                      116,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "deliveryPriceConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      100,
                      101,
                      108,
                      105,
                      118,
                      101,
                      114,
                      121,
                      95,
                      112,
                      114,
                      105,
                      99,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "relayerVault",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "relayerRewardAccount",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "mint",
              "docs": [
                "This is the token that user will deposit/borrow"
              ]
            },
            {
              "name": "vaultTokenAccount",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "account",
                    "path": "vaultConfig"
                  },
                  {
                    "kind": "const",
                    "value": [
                      6,
                      221,
                      246,
                      225,
                      215,
                      101,
                      161,
                      147,
                      217,
                      203,
                      225,
                      70,
                      206,
                      235,
                      121,
                      172,
                      28,
                      180,
                      133,
                      237,
                      95,
                      91,
                      55,
                      145,
                      58,
                      140,
                      245,
                      133,
                      126,
                      255,
                      0,
                      169
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "mint"
                  }
                ],
                "program": {
                  "kind": "const",
                  "value": [
                    140,
                    151,
                    37,
                    143,
                    78,
                    36,
                    137,
                    241,
                    187,
                    61,
                    16,
                    41,
                    20,
                    142,
                    13,
                    131,
                    11,
                    90,
                    19,
                    153,
                    218,
                    255,
                    16,
                    132,
                    4,
                    142,
                    123,
                    216,
                    219,
                    233,
                    248,
                    89
                  ]
                }
              }
            },
            {
              "name": "wormholeBridge",
              "docs": [
                "Wormhole bridge data. Mutable."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      66,
                      114,
                      105,
                      100,
                      103,
                      101
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeFeeCollector",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      102,
                      101,
                      101,
                      95,
                      99,
                      111,
                      108,
                      108,
                      101,
                      99,
                      116,
                      111,
                      114
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "customWormholeEmitter",
              "docs": [
                "This is our custom emitter account that will be used to send raw payload across wormhole core bridge"
              ],
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      101,
                      109,
                      105,
                      116,
                      116,
                      101,
                      114
                    ]
                  }
                ]
              }
            },
            {
              "name": "userMessageNonce",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      117,
                      115,
                      101,
                      114,
                      95,
                      109,
                      101,
                      115,
                      115,
                      97,
                      103,
                      101,
                      95,
                      110,
                      111,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "customEmitterWormholeSequence",
              "docs": [
                "This is not created until the first message is posted, so it needs to be an [UncheckedAccount]",
                "for wormhole_program (core bridge) to be able to create it. [`wormhole::post_message`] requires this account be mutable.",
                "Notice: this account belongs to wormhole_program who will increment seq for it",
                "and will use to generate seq number for a message (not signed VAA)"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      83,
                      101,
                      113,
                      117,
                      101,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "customWormholeEmitter"
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeMessage",
              "docs": [
                "",
                "Note: Must be our program PDA as this account is required to be CPI call signer.",
                "Note: As seed sequence we are passing `user_message_nonce.value`.",
                "It ensures that there will never be two messages with the same address at any point in time.",
                "Because each message has user/sender.key() and user nonce in seed which makes it unique.",
                "This prevents conflicts between transactions using the same `wormhole_message` account addresses."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      115,
                      101,
                      110,
                      116
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "user_message_nonce.value",
                    "account": "userMessageNonce"
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "wormholeProgram",
              "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            },
            {
              "name": "tokenProgram",
              "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
              "name": "associatedTokenProgram",
              "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            },
            {
              "name": "clock",
              "address": "SysvarC1ock11111111111111111111111111111111"
            },
            {
              "name": "rent",
              "address": "SysvarRent111111111111111111111111111111111"
            }
          ]
        }
      ],
      "args": [
        {
          "name": "userId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "pauseSpoke",
      "discriminator": [
        72,
        44,
        90,
        219,
        7,
        88,
        217,
        64
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "refundFailedDeposit",
      "docs": [
        "This function can be only called by an owner in case user deposit fails on Hub side (Hub Tx reverts)",
        "and therefore was not correctly accounted. In such case we need to manually refund user.",
        "",
        "# Arguments",
        "* `ctx` - accounts associated with this instruction",
        "* amount - amount to refund"
      ],
      "discriminator": [
        1,
        151,
        141,
        175,
        52,
        83,
        183,
        94
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "Mint for token that will be refunded"
          ]
        },
        {
          "name": "vaultConfig",
          "docs": [
            "Needs to be mut in case we need to refund SOL (which is stored directly on the account)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultConfig"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "refundWallet",
          "writable": true
        },
        {
          "name": "refundTokenAccount",
          "docs": [
            "Token account for refund wallet (an SPL token)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "refundWallet"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releaseFunds",
      "docs": [
        "This function will release funds to user.",
        "This function is called by third part relayer app",
        "",
        "# Arguments",
        "* `ctx` - accounts associated with this instruction",
        "* _delivery_instruction_vaa_hash - is used in instruction constraints, its delivery instruction vaa body hash"
      ],
      "discriminator": [
        225,
        88,
        91,
        108,
        126,
        52,
        2,
        26
      ],
      "accounts": [
        {
          "name": "relayerAccount",
          "writable": true,
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vaultConfig",
          "docs": [
            "Needs to be mut as it stores SOL that can be withdrawn"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "This is the token mint that will be withdrawn/borrowed"
          ]
        },
        {
          "name": "recipient",
          "docs": [
            "Mut in case we will receive native SOL (that it will go directly to wallet not ATA)"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "recipient"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultConfig"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "consumedNonce",
          "docs": [
            "program will create this account in handler."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  115,
                  117,
                  109,
                  101,
                  100,
                  95,
                  110,
                  111,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "deliveryInstructionVaa"
              },
              {
                "kind": "account",
                "path": "deliveryInstructionVaa"
              }
            ]
          }
        },
        {
          "name": "deliveryInstructionVaa",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  115,
                  116,
                  101,
                  100,
                  86,
                  65,
                  65
                ]
              },
              {
                "kind": "arg",
                "path": "deliveryInstructionVaaHash"
              }
            ],
            "program": {
              "kind": "account",
              "path": "wormholeProgram"
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "wormholeProgram",
          "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "deliveryInstructionVaaHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "repay",
      "docs": [
        "This function is used repay debt with regular spl tokens (eg.: JitoSOL, USDC) or native SOL.",
        "",
        "# Arguments",
        "",
        "* `ctx` - accounts associated with this instruction",
        "* `amount` - The amount of native tokens to repay"
      ],
      "discriminator": [
        234,
        103,
        67,
        82,
        208,
        234,
        219,
        166
      ],
      "accounts": [
        {
          "name": "generic",
          "accounts": [
            {
              "name": "sender",
              "writable": true,
              "signer": true
            },
            {
              "name": "baseConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      98,
                      97,
                      115,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "vaultConfig",
              "docs": [
                "Needs to be mut as it stores SOL"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      118,
                      97,
                      117,
                      108,
                      116,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "deliveryPriceConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      100,
                      101,
                      108,
                      105,
                      118,
                      101,
                      114,
                      121,
                      95,
                      112,
                      114,
                      105,
                      99,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "relayerVault",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "relayerRewardAccount",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "mint",
              "docs": [
                "This is the token that user will deposit/borrow"
              ]
            },
            {
              "name": "vaultTokenAccount",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "account",
                    "path": "vaultConfig"
                  },
                  {
                    "kind": "const",
                    "value": [
                      6,
                      221,
                      246,
                      225,
                      215,
                      101,
                      161,
                      147,
                      217,
                      203,
                      225,
                      70,
                      206,
                      235,
                      121,
                      172,
                      28,
                      180,
                      133,
                      237,
                      95,
                      91,
                      55,
                      145,
                      58,
                      140,
                      245,
                      133,
                      126,
                      255,
                      0,
                      169
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "mint"
                  }
                ],
                "program": {
                  "kind": "const",
                  "value": [
                    140,
                    151,
                    37,
                    143,
                    78,
                    36,
                    137,
                    241,
                    187,
                    61,
                    16,
                    41,
                    20,
                    142,
                    13,
                    131,
                    11,
                    90,
                    19,
                    153,
                    218,
                    255,
                    16,
                    132,
                    4,
                    142,
                    123,
                    216,
                    219,
                    233,
                    248,
                    89
                  ]
                }
              }
            },
            {
              "name": "wormholeBridge",
              "docs": [
                "Wormhole bridge data. Mutable."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      66,
                      114,
                      105,
                      100,
                      103,
                      101
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeFeeCollector",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      102,
                      101,
                      101,
                      95,
                      99,
                      111,
                      108,
                      108,
                      101,
                      99,
                      116,
                      111,
                      114
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "customWormholeEmitter",
              "docs": [
                "This is our custom emitter account that will be used to send raw payload across wormhole core bridge"
              ],
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      101,
                      109,
                      105,
                      116,
                      116,
                      101,
                      114
                    ]
                  }
                ]
              }
            },
            {
              "name": "userMessageNonce",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      117,
                      115,
                      101,
                      114,
                      95,
                      109,
                      101,
                      115,
                      115,
                      97,
                      103,
                      101,
                      95,
                      110,
                      111,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "customEmitterWormholeSequence",
              "docs": [
                "This is not created until the first message is posted, so it needs to be an [UncheckedAccount]",
                "for wormhole_program (core bridge) to be able to create it. [`wormhole::post_message`] requires this account be mutable.",
                "Notice: this account belongs to wormhole_program who will increment seq for it",
                "and will use to generate seq number for a message (not signed VAA)"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      83,
                      101,
                      113,
                      117,
                      101,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "customWormholeEmitter"
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeMessage",
              "docs": [
                "",
                "Note: Must be our program PDA as this account is required to be CPI call signer.",
                "Note: As seed sequence we are passing `user_message_nonce.value`.",
                "It ensures that there will never be two messages with the same address at any point in time.",
                "Because each message has user/sender.key() and user nonce in seed which makes it unique.",
                "This prevents conflicts between transactions using the same `wormhole_message` account addresses."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      115,
                      101,
                      110,
                      116
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "user_message_nonce.value",
                    "account": "userMessageNonce"
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "wormholeProgram",
              "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            },
            {
              "name": "tokenProgram",
              "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
              "name": "associatedTokenProgram",
              "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            },
            {
              "name": "clock",
              "address": "SysvarC1ock11111111111111111111111111111111"
            },
            {
              "name": "rent",
              "address": "SysvarRent111111111111111111111111111111111"
            }
          ]
        },
        {
          "name": "senderTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "generic.sender",
                "account": "genericSendMessage"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "generic.mint",
                "account": "genericSendMessage"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferOwnership",
      "discriminator": [
        65,
        177,
        215,
        73,
        53,
        45,
        99,
        47
      ],
      "accounts": [
        {
          "name": "userA",
          "signer": true
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "unpauseSpoke",
      "discriminator": [
        3,
        227,
        115,
        220,
        246,
        130,
        118,
        145
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "updateBaseConfig",
      "discriminator": [
        164,
        218,
        125,
        96,
        47,
        165,
        164,
        156
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "update",
          "type": {
            "defined": {
              "name": "baseConfigUpdateWrapper"
            }
          }
        }
      ]
    },
    {
      "name": "updateDeliveryPrice",
      "discriminator": [
        92,
        228,
        35,
        52,
        159,
        245,
        108,
        102
      ],
      "accounts": [
        {
          "name": "priceKeeper",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "deliveryPriceConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  105,
                  118,
                  101,
                  114,
                  121,
                  95,
                  112,
                  114,
                  105,
                  99,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "spokeReleaseFundsTxCostSol",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "hubTxCostSol",
          "type": "u64"
        },
        {
          "name": "maxDelayBetweenUpdates",
          "type": {
            "option": "u32"
          }
        }
      ]
    },
    {
      "name": "updateHubData",
      "discriminator": [
        180,
        61,
        160,
        71,
        74,
        85,
        203,
        247
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "baseConfig"
          ]
        },
        {
          "name": "baseConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  115,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "hubChainId",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "hubAddress",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "withdraw",
      "docs": [
        "This function is used to initiate a withdrawal of regular spl tokens (eg.: WSOL, WIF)",
        "or native SOL - not wormhole wrapped tokens.",
        "",
        "# Arguments",
        "",
        "* `ctx` - accounts associated with this instruction",
        "* `amount` - The amount of native tokens to repay"
      ],
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "generic",
          "accounts": [
            {
              "name": "sender",
              "writable": true,
              "signer": true
            },
            {
              "name": "baseConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      98,
                      97,
                      115,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "vaultConfig",
              "docs": [
                "Needs to be mut as it stores SOL"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      118,
                      97,
                      117,
                      108,
                      116,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "deliveryPriceConfig",
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      100,
                      101,
                      108,
                      105,
                      118,
                      101,
                      114,
                      121,
                      95,
                      112,
                      114,
                      105,
                      99,
                      101,
                      95,
                      99,
                      111,
                      110,
                      102,
                      105,
                      103
                    ]
                  }
                ]
              }
            },
            {
              "name": "relayerVault",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "relayerRewardAccount",
              "writable": true,
              "relations": [
                "baseConfig"
              ]
            },
            {
              "name": "mint",
              "docs": [
                "This is the token that user will deposit/borrow"
              ]
            },
            {
              "name": "vaultTokenAccount",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "account",
                    "path": "vaultConfig"
                  },
                  {
                    "kind": "const",
                    "value": [
                      6,
                      221,
                      246,
                      225,
                      215,
                      101,
                      161,
                      147,
                      217,
                      203,
                      225,
                      70,
                      206,
                      235,
                      121,
                      172,
                      28,
                      180,
                      133,
                      237,
                      95,
                      91,
                      55,
                      145,
                      58,
                      140,
                      245,
                      133,
                      126,
                      255,
                      0,
                      169
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "mint"
                  }
                ],
                "program": {
                  "kind": "const",
                  "value": [
                    140,
                    151,
                    37,
                    143,
                    78,
                    36,
                    137,
                    241,
                    187,
                    61,
                    16,
                    41,
                    20,
                    142,
                    13,
                    131,
                    11,
                    90,
                    19,
                    153,
                    218,
                    255,
                    16,
                    132,
                    4,
                    142,
                    123,
                    216,
                    219,
                    233,
                    248,
                    89
                  ]
                }
              }
            },
            {
              "name": "wormholeBridge",
              "docs": [
                "Wormhole bridge data. Mutable."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      66,
                      114,
                      105,
                      100,
                      103,
                      101
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeFeeCollector",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      102,
                      101,
                      101,
                      95,
                      99,
                      111,
                      108,
                      108,
                      101,
                      99,
                      116,
                      111,
                      114
                    ]
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "customWormholeEmitter",
              "docs": [
                "This is our custom emitter account that will be used to send raw payload across wormhole core bridge"
              ],
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      101,
                      109,
                      105,
                      116,
                      116,
                      101,
                      114
                    ]
                  }
                ]
              }
            },
            {
              "name": "userMessageNonce",
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      117,
                      115,
                      101,
                      114,
                      95,
                      109,
                      101,
                      115,
                      115,
                      97,
                      103,
                      101,
                      95,
                      110,
                      111,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "customEmitterWormholeSequence",
              "docs": [
                "This is not created until the first message is posted, so it needs to be an [UncheckedAccount]",
                "for wormhole_program (core bridge) to be able to create it. [`wormhole::post_message`] requires this account be mutable.",
                "Notice: this account belongs to wormhole_program who will increment seq for it",
                "and will use to generate seq number for a message (not signed VAA)"
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      83,
                      101,
                      113,
                      117,
                      101,
                      110,
                      99,
                      101
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "customWormholeEmitter"
                  }
                ],
                "program": {
                  "kind": "account",
                  "path": "wormholeProgram"
                }
              }
            },
            {
              "name": "wormholeMessage",
              "docs": [
                "",
                "Note: Must be our program PDA as this account is required to be CPI call signer.",
                "Note: As seed sequence we are passing `user_message_nonce.value`.",
                "It ensures that there will never be two messages with the same address at any point in time.",
                "Because each message has user/sender.key() and user nonce in seed which makes it unique.",
                "This prevents conflicts between transactions using the same `wormhole_message` account addresses."
              ],
              "writable": true,
              "pda": {
                "seeds": [
                  {
                    "kind": "const",
                    "value": [
                      115,
                      101,
                      110,
                      116
                    ]
                  },
                  {
                    "kind": "account",
                    "path": "user_message_nonce.value",
                    "account": "userMessageNonce"
                  },
                  {
                    "kind": "account",
                    "path": "sender"
                  }
                ]
              }
            },
            {
              "name": "wormholeProgram",
              "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            },
            {
              "name": "tokenProgram",
              "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
              "name": "associatedTokenProgram",
              "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            },
            {
              "name": "clock",
              "address": "SysvarC1ock11111111111111111111111111111111"
            },
            {
              "name": "rent",
              "address": "SysvarRent111111111111111111111111111111111"
            }
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "baseConfig",
      "discriminator": [
        50,
        248,
        43,
        149,
        247,
        152,
        229,
        71
      ]
    },
    {
      "name": "bridgeData",
      "discriminator": [
        44,
        150,
        210,
        208,
        130,
        71,
        35,
        174
      ]
    },
    {
      "name": "deliveryPriceConfig",
      "discriminator": [
        246,
        185,
        164,
        0,
        49,
        177,
        109,
        105
      ]
    },
    {
      "name": "feeCollector",
      "discriminator": [
        250,
        213,
        73,
        200,
        175,
        76,
        225,
        213
      ]
    },
    {
      "name": "userMessageNonce",
      "discriminator": [
        208,
        156,
        65,
        202,
        103,
        73,
        131,
        221
      ]
    },
    {
      "name": "vaultConfig",
      "discriminator": [
        99,
        86,
        43,
        216,
        184,
        102,
        119,
        77
      ]
    }
  ],
  "events": [
    {
      "name": "inboundTransferEvent",
      "discriminator": [
        159,
        22,
        11,
        137,
        245,
        76,
        49,
        204
      ]
    },
    {
      "name": "outboundTransferEvent",
      "discriminator": [
        225,
        253,
        33,
        134,
        245,
        43,
        48,
        116
      ]
    },
    {
      "name": "pairingAccountEvent",
      "discriminator": [
        119,
        178,
        238,
        32,
        189,
        237,
        43,
        158
      ]
    },
    {
      "name": "releaseFundsEvent",
      "discriminator": [
        156,
        241,
        58,
        41,
        202,
        170,
        124,
        59
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "zeroHubAddress",
      "msg": "Hub address can not be 0"
    },
    {
      "code": 6001,
      "name": "invalidHubChainId",
      "msg": "Hub chain id can not be 1"
    },
    {
      "code": 6002,
      "name": "invalidOwner",
      "msg": "Invalid Owner"
    },
    {
      "code": 6003,
      "name": "invalidPendingOwner",
      "msg": "Invalid pending owner"
    },
    {
      "code": 6004,
      "name": "transferNotInitiated",
      "msg": "Ownership transfer not started"
    },
    {
      "code": 6005,
      "name": "programPaused",
      "msg": "Program can not be paused"
    },
    {
      "code": 6006,
      "name": "invalidTokenBridgeConfigAddress",
      "msg": "Invalid token bridge config address"
    },
    {
      "code": 6007,
      "name": "zeroInboundTransferAmount",
      "msg": "Inbound transfer amount is 0"
    },
    {
      "code": 6008,
      "name": "notEnoughTokens",
      "msg": "Not enough tokens"
    },
    {
      "code": 6009,
      "name": "notEnoughSol",
      "msg": "Not enough sol"
    },
    {
      "code": 6010,
      "name": "notEnoughSolForFees",
      "msg": "Not enough sol for fees"
    },
    {
      "code": 6011,
      "name": "invalidContextMeta",
      "msg": "Invalid context meta"
    },
    {
      "code": 6012,
      "name": "alreadyRedeemed",
      "msg": "Already redeemed"
    },
    {
      "code": 6013,
      "name": "invalidTokenBridgeForeignEndpoint",
      "msg": "Foreign endpoint different than registered one"
    },
    {
      "code": 6014,
      "name": "invalidTargetRecipient",
      "msg": "Invalid target recipient"
    },
    {
      "code": 6015,
      "name": "invalidWalletRecipient",
      "msg": "Invalid wallet recipient"
    },
    {
      "code": 6016,
      "name": "mustBeWSolMint",
      "msg": "Must be wsol mint"
    },
    {
      "code": 6017,
      "name": "redeemedAmountMismatch",
      "msg": "Expected vaa amount different than redeemed"
    },
    {
      "code": 6018,
      "name": "notEnoughTokensInCustody",
      "msg": "Not enough tokens in custody to redeem"
    },
    {
      "code": 6019,
      "name": "invalidTargetAddress",
      "msg": "Invalid target address"
    },
    {
      "code": 6020,
      "name": "invalidSourceChain",
      "msg": "Invalid source chain"
    },
    {
      "code": 6021,
      "name": "invalidTransferAmount",
      "msg": "Invalid transfer Amount"
    },
    {
      "code": 6022,
      "name": "invalidTokenAddress",
      "msg": "Invalid token address"
    },
    {
      "code": 6023,
      "name": "invalidAmountOfMessageKeys",
      "msg": "Invalid amount on message keys"
    },
    {
      "code": 6024,
      "name": "invalidVaaKeyAttached",
      "msg": "Invalid vaa key attached"
    },
    {
      "code": 6025,
      "name": "invalidWormholeRelayerAddress",
      "msg": "Invalid wormhole relayer address"
    },
    {
      "code": 6026,
      "name": "invalidWormholeTunnelAddress",
      "msg": "Invalid wormhole tunnel address"
    },
    {
      "code": 6027,
      "name": "mintNotEqualToTokenMintInVaa",
      "msg": "Mint must match the mint in VAA msg"
    },
    {
      "code": 6028,
      "name": "notRegisteredRelayer",
      "msg": "Not registered relayer"
    },
    {
      "code": 6029,
      "name": "notRelayerRewardAccount",
      "msg": "Not a registered relayer reward account"
    },
    {
      "code": 6030,
      "name": "notRelayerVaultAccount",
      "msg": "Not a registered relayer vault account"
    },
    {
      "code": 6031,
      "name": "staleDeliveryPrices",
      "msg": "Stale delivery prices"
    },
    {
      "code": 6032,
      "name": "userMessageNonceAccountNotCreated",
      "msg": "UserMessageNonce account not created"
    },
    {
      "code": 6033,
      "name": "vaaInvalidEmitterChain",
      "msg": "Vaa: invalid emitter chain"
    },
    {
      "code": 6034,
      "name": "vaaInvalidEmitterAddress",
      "msg": "Vaa: invalid emitter address"
    },
    {
      "code": 6035,
      "name": "vaaInvalidForeignContractAddress",
      "msg": "Vaa: invalid foreign wormhole tunnel address"
    },
    {
      "code": 6036,
      "name": "vaaInvalidDestinationChain",
      "msg": "Vaa: invalid destination chain"
    },
    {
      "code": 6037,
      "name": "vaaInvalidTokenChain",
      "msg": "Vaa: invalid token chain"
    },
    {
      "code": 6038,
      "name": "vaaInvalidDestinationProgramAddress",
      "msg": "Vaa: invalid destination program address"
    },
    {
      "code": 6039,
      "name": "failedToDecodeAbi",
      "msg": "Failed to decode ABI"
    },
    {
      "code": 6040,
      "name": "invalidFinalityValue",
      "msg": "Invalid finality"
    },
    {
      "code": 6041,
      "name": "messageFormatUnknown",
      "msg": "Message format unknown"
    },
    {
      "code": 6042,
      "name": "invalidPayloadLength",
      "msg": "Invalid payload length"
    },
    {
      "code": 6043,
      "name": "failedToDecodePayloadLength",
      "msg": "Failed to decode payload length"
    },
    {
      "code": 6044,
      "name": "invalidDeliveryInstructionPayloadId",
      "msg": "Invalid DeliveryInstruction payload ID"
    },
    {
      "code": 6045,
      "name": "emptyDeliveryInstruction",
      "msg": "Empty DeliveryInstruction"
    },
    {
      "code": 6046,
      "name": "failedToReadBytes",
      "msg": "Failed to read bytes"
    },
    {
      "code": 6047,
      "name": "invalidVaaKeyLength",
      "msg": "Invalid VAA Key length"
    },
    {
      "code": 6048,
      "name": "nonceAlreadyConsumed",
      "msg": "Nonce already consumed"
    },
    {
      "code": 6049,
      "name": "zeroOutboundTransferAmount",
      "msg": "Outbound transfer amount is 0"
    },
    {
      "code": 6050,
      "name": "zeroUserAccount",
      "msg": "User account can not be 0x0"
    },
    {
      "code": 6051,
      "name": "pdaAccountAlreadyInitialized",
      "msg": "PDA account already initialized"
    },
    {
      "code": 6052,
      "name": "invalidEvmTargetSelector",
      "msg": "Invalid Evm target selector"
    },
    {
      "code": 6053,
      "name": "invalidFinality",
      "msg": "Invalid finality"
    }
  ],
  "types": [
    {
      "name": "baseConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "Program's owner."
            ],
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "paused",
            "docs": [
              "Boolean indicating whether contract is paused"
            ],
            "type": "bool"
          },
          {
            "name": "hubChainId",
            "docs": [
              "Hub chain Id. Cannot equal `1` (Solana's Chain ID)."
            ],
            "type": "u16"
          },
          {
            "name": "hubAddress",
            "docs": [
              "Contract address of the hub. Cannot be zero address."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "foreignWormholeTunnel",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "foreignCustomWormholeRelayer",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "relayerReward",
            "docs": [
              "reward for relayer for tx relaying the tx to other chain"
            ],
            "type": "u64"
          },
          {
            "name": "relayerAccount",
            "docs": [
              "Relayer EOA that can invoke redeem functions"
            ],
            "type": "pubkey"
          },
          {
            "name": "relayerRewardAccount",
            "docs": [
              "Account where relayer rewards are sent"
            ],
            "type": "pubkey"
          },
          {
            "name": "relayerVault",
            "docs": [
              "Account where hub delivery payments are sent"
            ],
            "type": "pubkey"
          },
          {
            "name": "priceKeeper",
            "docs": [
              "Account EOA that can update delivery prices"
            ],
            "type": "pubkey"
          },
          {
            "name": "finality",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "baseConfigInitWrapper",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hubChainId",
            "type": "u16"
          },
          {
            "name": "hubAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "foreignWormholeTunnel",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "foreignCustomWormholeRelayer",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "relayerReward",
            "type": "u64"
          },
          {
            "name": "spokeReleaseFundsTxCostSol",
            "type": "u64"
          },
          {
            "name": "hubTxCostSol",
            "type": "u64"
          },
          {
            "name": "relayerAccount",
            "type": "pubkey"
          },
          {
            "name": "relayerRewardAccount",
            "type": "pubkey"
          },
          {
            "name": "relayerVault",
            "type": "pubkey"
          },
          {
            "name": "priceKeeper",
            "type": "pubkey"
          },
          {
            "name": "finality",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "baseConfigUpdateWrapper",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "foreignWormholeTunnel",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "foreignCustomWormholeRelayer",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "relayerReward",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "relayerAccount",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "relayerRewardAccount",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "relayerVault",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "priceKeeper",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "finality",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "bridgeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetExpirationTime",
            "docs": [
              "Period for how long a guardian set is valid after it has been replaced by a new one.  This",
              "guarantees that VAAs issued by that set can still be submitted for a certain period.  In",
              "this period we still trust the old guardian set."
            ],
            "type": "u32"
          },
          {
            "name": "fee",
            "docs": [
              "Amount of lamports that needs to be paid to the protocol to post a message"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "bridgeData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetIndex",
            "docs": [
              "The current guardian set index, used to decide which signature sets to accept."
            ],
            "type": "u32"
          },
          {
            "name": "lastLamports",
            "docs": [
              "Lamports in the collection account"
            ],
            "type": "u64"
          },
          {
            "name": "config",
            "docs": [
              "Bridge configuration, which is set once upon initialization."
            ],
            "type": {
              "defined": {
                "name": "bridgeConfig"
              }
            }
          }
        ]
      }
    },
    {
      "name": "deliveryPriceConfig",
      "docs": [
        "Delivery Price Config",
        "",
        "This account holds the configuration for delivery prices between spoke and hub",
        "",
        "# Fields",
        "",
        "* `spoke_release_funds_tx_cost_sol` - cost in SOL(lamports) for spoke release_funds tx",
        "* `hub_tx_cost_sol` - cost in SOL(lamports)  for hub tx",
        "* `max_delay_between_updates` - maximum delay between updates in seconds",
        "* `last_update_timestamp` - timestamp of last update in seconds"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "spokeReleaseFundsTxCostSol",
            "type": "u64"
          },
          {
            "name": "hubTxCostSol",
            "type": "u64"
          },
          {
            "name": "maxDelayBetweenUpdates",
            "type": "u32"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "feeCollector",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "inboundTransferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actionType",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "outboundTransferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actionType",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pairingAccountEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAccount",
            "type": "pubkey"
          },
          {
            "name": "userId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "releaseFundsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userMessageNonce",
      "docs": [
        "User message nonce",
        "This struct is used in two cases:",
        "1. Spoke <-> It ensures that no replayed responses from the Hub will be processed.",
        "",
        "2. As a seed to the `wormhole_message` account: It ensures that there will never be two messages with the",
        "same address (and nonce) at any point in time. This prevents conflicts between transactions using the same",
        "`wormhole_message` account addresses (avoiding race conditions).",
        "",
        "Previously, the `spoke_message_sequence` provided this functionality and also kept track of the message count.",
        "However, since there will no longer be `token_bridge`/`cctp` messages, the message count is now derived from",
        "the `custom_emitter_wormhole_sequence`"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultConfig",
      "docs": [
        "Vault config pda account is used as owner for ATA accounts of tokens deposited to into Spoke.",
        "This account is also vault for SOL so it must be initialized."
      ],
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ]
};

# Solana TypeScript SDK

It contains IDL types generated from Solana spoke program.

## Install and quick check

### Install

```
yarn install
```

### Build and quick check

Build:
```
yarn run clean
yarn run build
```

Quick check:

This will execute a set of transactions against the program with the ID set in the IDL.  

These are essentially smoke tests; they will do nothing significant and fail only within the handler body.  

This means that the entire Anchor instruction accounts validation has passed, which is the purpose of these tests.

```
yarn run start-test
```

### Howto import to project:

Import as github dependency:

Main repo:
```
"solana-sdk": "git+https://github.com/SynonymFinance/solana-sdk"
```
If specific commit hash is required:
```
"solana-sdk": "git+https://github.com/SynonymFinance/solana-sdk#0e01163c0e046c9253c3a976bf6f28e338010091"
```

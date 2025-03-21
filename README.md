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

# **Releasing a New Version of the Package**

## Prerequisites
1. You must have an NPM account. (https://www.npmjs.com/)
2. You must have the necessary permissions to publish the package.
3. You must have the latest version of the package.

## **Step 1: Update the Version**
1. Open the `package.json` file.
2. Update the `"version"` field according to [Semantic Versioning](https://semver.org/):
   - `MAJOR.MINOR.PATCH` (e.g., change from `1.0.0` to `1.1.0` or `1.0.1`).


## **Step 2: Build the Package**
Run the following command to build the package:

```
yarn run build
```

## **Step 3: Create a Package Archive File**
Generate the .tgz package file by running the following command:

```
yarn pack
```

## **Step 4: Publish the Package**
Release the package to the public registry:

```
yarn publish --access public
```

## **Step 5: Verify the Release**

1.Go to the package's NPM page to confirm the version update.
2.Verify that the package is available and that everything was published successfully.

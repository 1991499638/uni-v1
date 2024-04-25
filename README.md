# Uniswap V1 Exchange Contract

This repository contains a Solidity smart contract implementing a basic version of the Uniswap V1 Exchange. Uniswap V1 was one of the early decentralized exchange protocols on Ethereum, allowing users to swap tokens and provide liquidity to token pairs. This contract includes functionalities for adding and removing liquidity, as well as swapping tokens with ETH.

## Contract Overview

The Exchange contract inherits from the ERC20 standard and implements basic Uniswap V1 functionalities. It includes the following features:

- Adding liquidity to the exchange by providing tokens and ETH.
- Removing liquidity and receiving tokens and ETH in return.
- Swapping ETH for tokens and tokens for ETH.

## Getting Started

1. Install dependencies:
   This contract uses the OpenZeppelin library, specifically the ERC20 implementation. Ensure you have OpenZeppelin installed.

2. Deploy the Contract:
   Deploy the Exchange contract by passing the address of the token you want to use in the exchange to the constructor.

3. Interact with the Contract:
   Use the provided functions to add liquidity, remove liquidity, and perform token swaps. Check the contract documentation for each function's purpose and usage.

## Contract Deployment and Testing

This repository primarily focuses on providing the Exchange contract's source code and basic documentation. To deploy and test the contract, follow these steps:

1. Set up a development environment with Solidity compiler and Ethereum node.

2. Deploy the contract to a local or testnet Ethereum network using a development tool like Remix or Truffle.

3. Write and execute tests to ensure the contract behaves as expected. The test cases should cover different scenarios, including adding/removing liquidity and performing swaps.

## Caution

There are some potential vulnerabilities for this Uniswap V1 Exchange contract that will be addressed in the upcoming version two V2, dont use this for any production purpose:

1. **Front-Running Attacks:**
   The contract doesn't implement any mechanism to prevent front-running attacks. Front-running occurs when an attacker observes a transaction that is about to be included in a block and quickly submits a transaction to exploit the known outcome. This could be a problem, especially when users are swapping tokens, as the attacker might manipulate prices in their favor.

2. **Reentrancy Vulnerability:**
   There are no explicit checks for reentrancy attacks, which could lead to issues where a malicious contract could call back into the `addLiquidity` or `removeLiquidity` functions before the previous call completes, potentially leading to unintended behavior or draining funds.

3. **Integer Overflow/Underflow:**
   The contract performs arithmetic operations in several places, such as calculating amounts, balances, and token swaps. Without proper checks and mitigations, these operations could result in integer overflow or underflow vulnerabilities, leading to incorrect calculations or unexpected behavior.

4. **Lack of Access Control:**
   The contract does not implement access control mechanisms for critical functions. Anyone can call functions like `addLiquidity`, `removeLiquidity`, and swaps, which could lead to unauthorized or malicious use of the contract.

5. **Lack of Oracle and Price Manipulation:**
   The contract doesn't use oracles to obtain accurate price information, making it vulnerable to price manipulation attacks. Malicious actors could exploit this by artificially inflating or deflating prices during token swaps.

6. **Gas Limit Issues:**
   Depending on the complexity of the operations within the contract, certain functions might consume a high amount of gas, potentially causing transactions to fail due to gas limits. This could lead to unpredictable behavior or failed transactions.

7. **Unchecked Return Values:**
   Some of the contract's external calls (e.g., token transfers) do not check the return values, which could result in a failure to handle cases where a transfer does not succeed as expected.

8. **Missing Events and Logging:**
   The contract does not emit events for significant state changes. Events are important for off-chain applications to monitor and respond to on-chain activities.

9. **Front-Running Token Transfers:**
   The contract uses the `transfer` function for token transfers, which does not provide any guarantee of executing external contract code. This can lead to front-running attacks in cases where an attacker anticipates the transaction and manipulates the state accordingly.

10. **Non-Reentrancy Guard Missing:**
    In functions like `ethToTokenSwap` and `tokenToEthSwap`, a non-reentrancy guard should be implemented to prevent reentrancy attacks. The state should be updated before any external call to prevent potential recursive calls.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is a simplified version of the Uniswap V1 Exchange contract and should not be used in production environments without proper security audits. Always exercise caution when dealing with smart contracts and blockchain-related projects.

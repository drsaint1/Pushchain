import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // Push Chain Donut Testnet
    // Note: Get the official RPC URL and Chain ID from Push Chain docs or community
    pushDonut: {
      url: process.env.PUSH_RPC_URL || "https://rpc.push.org", // Update with official RPC
      chainId: parseInt(process.env.PUSH_CHAIN_ID || "0"), // Update with official Chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000,
      gas: 6000000,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;

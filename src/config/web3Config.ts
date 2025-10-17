import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet, sepolia } from "wagmi/chains";

export const pushchainMainnet = {
  id: 42793,
  name: "Pushchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "PC",
    symbol: "PC",
  },
  rpcUrls: {
    default: {
      http: ["https://node.mainnet.push.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pushchain Explorer",
      url: "https://explorer.push.com",
    },
  },
} as const;

export const pushchainTestnet = {
  id: 42101,
  name: "Push Chain Donut Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "PC",
    symbol: "PC",
  },
  rpcUrls: {
    default: {
      http: ["https://evm.rpc-testnet-donut-node1.push.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Push Chain Donut Explorer",
      url: "https://donut.push.network",
    },
  },
  testnet: true,
} as const;

export const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "your_project_id_here";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "PushGame",
  description: "A thrilling 3D car racing game on Pushchain",
  url: "https://your-domain.com",
  icons: ["https://your-domain.com/icon.png"],
};

const chains = [pushchainMainnet, pushchainTestnet, mainnet, sepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

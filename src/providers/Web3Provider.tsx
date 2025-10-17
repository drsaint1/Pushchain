import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider, useAccount, useSwitchChain } from "wagmi";
import { config, projectId, pushchainTestnet } from "../config/web3Config";
import { ReactNode, useEffect } from "react";
import PushChainProvider from "./PushChainProvider";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#00DCFF",
    "--w3m-color-mix-strength": 20,
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

function NetworkSwitcher({ children }: { children: ReactNode }) {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== pushchainTestnet.id) {
      console.log(`🔄 Auto-switching from chain ${chainId} to Pushchain Testnet`);
      switchChain({ chainId: pushchainTestnet.id });
    }
  }, [isConnected, chainId, switchChain]);

  return <>{children}</>;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PushChainProvider>
          <NetworkSwitcher>{children}</NetworkSwitcher>
        </PushChainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

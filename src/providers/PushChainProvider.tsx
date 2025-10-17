import { ReactNode } from 'react';
import { PushUniversalWalletProvider } from '@pushchain/ui-kit';

interface PushChainProviderProps {
  children: ReactNode;
}

/**
 * PushChainProvider - Wraps the application with Push Chain's Universal App functionality
 * This enables cross-chain transactions from any chain (Ethereum, Solana, Base, etc.)
 * without requiring users to switch networks or hold specific tokens
 */
export default function PushChainProvider({ children }: PushChainProviderProps) {
  return (
    <PushUniversalWalletProvider
      config={{
        network: 'TESTNET_DONUT', // Push Chain Donut Testnet
        appName: 'PushChain Racing Game',
        appDescription: 'A thrilling 3D car racing game on Push Chain',
        appUrl: typeof window !== 'undefined' ? window.location.origin : '',
        appIcon: '/logo.png', // Update with your actual logo path
      }}
    >
      {children}
    </PushUniversalWalletProvider>
  );
}

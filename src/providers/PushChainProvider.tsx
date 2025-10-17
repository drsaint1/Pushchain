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
        network: 'TESTNET_DONUT' as any, // Push Chain Donut Testnet
      }}
    >
      {children}
    </PushUniversalWalletProvider>
  );
}

import { usePushChainClient, usePushWalletContext } from '@pushchain/ui-kit';
import { useCallback } from 'react';

/**
 * Custom hook to interact with Push Chain Universal App features
 * Enables cross-chain transactions and universal account management
 */
export function usePushChainUniversal() {
  const { pushChainClient, isInitialized } = usePushChainClient();
  const wallet = usePushWalletContext();

  /**
   * Execute a universal transaction that can be initiated from any chain
   * This is the key feature that makes your app truly universal
   */
  const executeUniversalTransaction = useCallback(
    async (params: {
      to: string;
      data: string;
      value?: bigint;
    }) => {
      if (!pushChainClient) {
        throw new Error('Push Chain client not initialized');
      }

      try {
        console.log('📡 Executing universal transaction...', params);

        // Use Push Chain's universal.sendTransaction to execute cross-chain
        const txHash = await pushChainClient.universal.sendTransaction({
          to: params.to,
          data: params.data,
          value: params.value || 0n,
        });

        console.log('✅ Universal transaction successful:', txHash);
        return txHash;
      } catch (error) {
        console.error('❌ Universal transaction failed:', error);
        throw error;
      }
    },
    [pushChainClient]
  );

  /**
   * Get the universal account address
   * This address works across all supported chains
   */
  const getUniversalAccount = useCallback(() => {
    if (!pushChainClient) {
      return null;
    }
    return pushChainClient.universal.account;
  }, [pushChainClient]);

  /**
   * Get the origin account (the wallet user is connected with)
   */
  const getOriginAccount = useCallback(() => {
    if (!pushChainClient) {
      return null;
    }
    return pushChainClient.universal.origin;
  }, [pushChainClient]);

  /**
   * Sign a message using the universal signer
   */
  const signMessage = useCallback(
    async (message: string) => {
      if (!pushChainClient) {
        throw new Error('Push Chain client not initialized');
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(message);

      return await pushChainClient.universal.signMessage(data);
    },
    [pushChainClient]
  );

  return {
    pushChainClient,
    wallet,
    executeUniversalTransaction,
    getUniversalAccount,
    getOriginAccount,
    signMessage,
    isConnected: wallet?.isConnected || false,
    isInitialized,
  };
}

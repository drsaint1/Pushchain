import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { PushUniversalAccountButton } from "@pushchain/ui-kit";
import { usePushChainUniversal } from "../hooks/usePushChainUniversal";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isConnected: isPushConnected } = usePushChainUniversal();

  // Show Push Chain Universal Button if Push Chain is available
  if (isPushConnected) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          padding: "6px 12px",
          backgroundColor: "#10b981",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "white"
        }}>
          🌐 Universal App
        </div>
        <PushUniversalAccountButton />
      </div>
    );
  }

  // Fallback to regular wallet connection
  if (isConnected) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px", color: "#ccc" }}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
      <button
        onClick={() => open()}
        style={{
          padding: "12px 24px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Connect Wallet
      </button>
      <span style={{ fontSize: "12px", color: "#888" }}>or</span>
      <PushUniversalAccountButton />
    </div>
  );
}

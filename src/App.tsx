import { useState, useEffect } from "react";
import Web3Provider from "./providers/Web3Provider";
import EnhancedCarRaceGame from "./components/EnhancedCarRaceGame";
import TournamentLobby from "./components/TournamentLobby";
import Leaderboard from "./components/Leaderboard";
import ConnectButton from "./components/ConnectButton";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useRacingContract } from "./hooks/useRacingContract";
import { usePushChainUniversal } from "./hooks/usePushChainUniversal";

type GameView = "menu" | "racing" | "tournament" | "leaderboard";

function GameWrapper() {
  const { isConnected } = useAccount();
  const { isConnected: isPushConnected } = usePushChainUniversal();

  // User is connected if either wagmi wallet OR Push Chain Universal wallet is connected
  const userIsConnected = isConnected || isPushConnected;
  const {
    selectedCar,
    playerCars,
    loading: carLoading,
    mintStarterCar,
    isPending,
    refetchCars,
  } = useRacingContract();
  const [currentView, setCurrentView] = useState<GameView>("menu");
  const [activeTournamentId, setActiveTournamentId] = useState<number | null>(
    null
  );
  const [completedTournaments, setCompletedTournaments] = useState<Set<number>>(new Set());
  const [mintingStatus, setMintingStatus] = useState<
    "idle" | "wallet_confirm" | "confirming" | "success" | "error" | "rejected"
  >("idle");
  const [mintingMessage, setMintingMessage] = useState<string>("");
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [hasSuccessfullyMinted, setHasSuccessfullyMinted] =
    useState<boolean>(false);

  const { isSuccess: isConfirmed, isError: isConfirmError } =
    useWaitForTransactionReceipt({
      hash: currentTxHash as `0x${string}`,
      query: { enabled: !!currentTxHash },
    });

  useEffect(() => {
    if (isConfirmed && mintingStatus === "confirming") {
      setMintingStatus("success");
      setHasSuccessfullyMinted(true);
      setMintingMessage(
        " Congratulations! You have successfully purchased your first NFT car!"
      );

      refetchCars();

      setTimeout(() => {
        setMintingMessage("🎮 Entering the game...");

        refetchCars();
      }, 2000);

      setTimeout(() => {
        setCurrentView("menu");
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);

        setTimeout(() => {
          if (playerCars.length === 0) {
            setHasSuccessfullyMinted(false);
          }
        }, 3000);
      }, 3500);
    } else if (isConfirmError && mintingStatus === "confirming") {
      setMintingStatus("error");
      setMintingMessage(" Transaction failed on blockchain. Please try again.");

      setTimeout(() => {
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);
        setHasSuccessfullyMinted(false);
      }, 2000);
    }
  }, [isConfirmed, isConfirmError, mintingStatus]);

  const handleStartRace = (tournamentId?: number) => {
    setActiveTournamentId(tournamentId || null);
    setCurrentView("racing");
  };

  const handleTournamentCompleted = (tournamentId: number) => {
    console.log(`🏆 Tournament ${tournamentId} completed! Marking as completed.`);
    setCompletedTournaments(prev => new Set([...prev, tournamentId]));
  };

  const handleNavigateToTournaments = () => {
    setActiveTournamentId(null);
    setCurrentView("tournament");
  };

  const handleNavigateToMenu = () => {
    setActiveTournamentId(null);
    setCurrentView("menu");
  };

  const handleMintStarterCar = async () => {
    try {
      setMintingStatus("wallet_confirm");
      setMintingMessage("💳 Please confirm the transaction in your wallet...");

      const txHash = await mintStarterCar();

      setCurrentTxHash(txHash);
      setMintingStatus("confirming");
      setMintingMessage("⏳ Waiting for blockchain confirmation...");
    } catch (error: any) {
      console.error("Minting error:", error);

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("user rejected") ||
        error.code === 4001
      ) {
        setMintingStatus("rejected");
        setMintingMessage(
          "❌ Transaction rejected by user. Please try again when ready."
        );
      } else if (error.message?.includes("insufficient")) {
        setMintingStatus("error");
        setMintingMessage(
          "❌ Insufficient funds. You need at least 0.01 PC to mint a Starter Racer."
        );
      } else if (error.message?.includes("Already has starter car")) {
        setMintingStatus("error");
        setMintingMessage(
          "❌ You already have a starter car. Please refresh the page."
        );
      } else {
        setMintingStatus("error");
        setMintingMessage(
          "❌ Minting failed. Please check your wallet and try again."
        );
      }

      setTimeout(() => {
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);
        setHasSuccessfullyMinted(false);
      }, 2000);
    }
  };

  if (!userIsConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            background: `radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
            animation: "pulse 8s ease-in-out infinite",
          }}
        />

        {/* Top right connect button */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            zIndex: 50,
          }}
        >
          <ConnectButton />
        </div>

        {/* Main content */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            maxWidth: "1100px",
            padding: "20px",
            zIndex: 10,
          }}
        >
          {/* Hero Section */}
          <div style={{ marginBottom: "35px" }}>
            <div
              style={{
                fontSize: "60px",
                marginBottom: "12px",
                filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              🏎️
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                marginBottom: "12px",
                background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #00ff88 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-1px",
                textShadow: "0 0 80px rgba(255, 215, 0, 0.3)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              PushChain Racing
            </h1>
            <p
              style={{
                fontSize: "20px",
                marginBottom: "15px",
                opacity: 0.9,
                fontWeight: "500",
                letterSpacing: "0.5px",
              }}
            >
              The Ultimate Universal Blockchain Racing Experience
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 20px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "30px",
                marginBottom: "25px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🌐</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>
                Universal App - Play from Any Chain
              </span>
            </div>
          </div>

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              className="feature-card"
              style={{
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)",
                padding: "25px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                border: "2px solid rgba(255, 215, 0, 0.2)",
                boxShadow: "0 8px 32px rgba(255, 215, 0, 0.15)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(255, 215, 0, 0.3)";
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 215, 0, 0.15)";
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.2)";
              }}
            >
              <div style={{ fontSize: "38px", marginBottom: "12px" }}>🏆</div>
              <h3 style={{ marginBottom: "10px", color: "#ffd700", fontSize: "20px", fontWeight: "700" }}>
                Compete & Earn
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, lineHeight: "1.5" }}>
                Join tournaments, win PC prizes, and climb the global leaderboard!
              </p>
            </div>

            <div
              className="feature-card"
              style={{
                background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                padding: "25px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                border: "2px solid rgba(0, 255, 136, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 255, 136, 0.15)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0, 255, 136, 0.3)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 136, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 255, 136, 0.15)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 136, 0.2)";
              }}
            >
              <div style={{ fontSize: "38px", marginBottom: "12px" }}>🚗</div>
              <h3 style={{ marginBottom: "10px", color: "#00ff88", fontSize: "20px", fontWeight: "700" }}>
                Collect NFT Cars
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, lineHeight: "1.5" }}>
                Mint and breed unique racing cars with different stats. Build your garage!
              </p>
            </div>

            <div
              className="feature-card"
              style={{
                background: "linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                padding: "25px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                border: "2px solid rgba(255, 107, 107, 0.2)",
                boxShadow: "0 8px 32px rgba(255, 107, 107, 0.15)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(255, 107, 107, 0.3)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 107, 107, 0.15)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.2)";
              }}
            >
              <div style={{ fontSize: "38px", marginBottom: "12px" }}>⚡</div>
              <h3 style={{ marginBottom: "10px", color: "#ff6b6b", fontSize: "20px", fontWeight: "700" }}>
                Lightning Fast
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, lineHeight: "1.5" }}>
                Instant confirmations and minimal fees. No network switching required!
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div
            style={{
              padding: "30px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              maxWidth: "550px",
              margin: "0 auto",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "12px", fontWeight: "700" }}>
              Ready to Race?
            </h3>
            <p
              style={{
                fontSize: "15px",
                opacity: 0.9,
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              Connect your wallet from any chain - Ethereum, Solana, Polygon, Base, and more.
              No need to switch networks!
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "14px", opacity: 0.8 }}>Powered by</span>
              <span style={{
                fontSize: "16px",
                fontWeight: "700",
                background: "linear-gradient(45deg, #ffd700, #ff6b6b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Push Chain
              </span>
              <span style={{ fontSize: "14px", opacity: 0.8 }}>✨</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔍 App state:", {
    isConnected,
    isPushConnected,
    userIsConnected,
    carLoading,
    playerCarsLength: playerCars.length,
    hasSuccessfullyMinted,
    mintingStatus,
    currentView,
  });

  if (
    userIsConnected &&
    !carLoading &&
    playerCars.length === 0 &&
    !hasSuccessfullyMinted
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            background: `radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
            animation: "pulse 8s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 50,
          }}
        >
          <ConnectButton />
        </div>

        <div
          style={{
            textAlign: "center",
            color: "white",
            maxWidth: "500px",
            padding: "10px 15px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* Hero Section */}
          <div
            style={{
              fontSize: "40px",
              marginBottom: "6px",
              filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🏎️
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "900",
              marginBottom: "6px",
              background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            Welcome to PushChain Racing!
          </h1>
          <p
            style={{
              fontSize: "13px",
              marginBottom: "12px",
              opacity: 0.9,
              lineHeight: "1.4",
            }}
          >
            Mint your first NFT car to enter the world of blockchain racing
          </p>

          {/* Main Mint Card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 107, 107, 0.08) 100%)",
              borderRadius: "20px",
              padding: "18px 16px",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 12px 36px rgba(255, 215, 0, 0.15)",
            }}
          >
            {/* Car Preview Section */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "12px",
                border: "1px solid rgba(255, 215, 0, 0.2)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏁</div>
              <h3 style={{ marginBottom: "6px", fontSize: "18px", fontWeight: "700", color: "#ffd700" }}>
                Starter Racer NFT
              </h3>
              <p style={{ marginBottom: "10px", opacity: 0.85, fontSize: "12px", lineHeight: "1.3" }}>
                Your gateway to blockchain racing! Access to tournaments, rewards, and racing legacy.
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 215, 0, 0.1)",
                    padding: "6px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "14px", marginBottom: "2px" }}>⚡</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>Speed</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#ffd700" }}>50</div>
                </div>
                <div
                  style={{
                    background: "rgba(0, 255, 136, 0.1)",
                    padding: "6px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 255, 136, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "14px", marginBottom: "2px" }}>🎯</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>Handling</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#00ff88" }}>50</div>
                </div>
                <div
                  style={{
                    background: "rgba(255, 107, 107, 0.1)",
                    padding: "6px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 107, 107, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "14px", marginBottom: "2px" }}>🚀</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>Accel</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#ff6b6b" }}>50</div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                marginBottom: "12px",
                padding: "12px 14px",
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)",
                borderRadius: "12px",
                border: "2px solid rgba(255, 215, 0, 0.4)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: "600", opacity: 0.9 }}>
                Mint Price
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "900",
                  color: "#ffd700",
                  textShadow: "0 2px 10px rgba(255, 215, 0, 0.5)",
                }}
              >
                0.01 PC
              </span>
            </div>

            {/* Status Message */}
            {mintingMessage && (
              <div
                style={{
                  marginBottom: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    mintingStatus === "success"
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)"
                      : mintingStatus === "error" || mintingStatus === "rejected"
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)"
                      : "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)",
                  border: `1px solid ${
                    mintingStatus === "success"
                      ? "rgba(16, 185, 129, 0.4)"
                      : mintingStatus === "error" || mintingStatus === "rejected"
                      ? "rgba(239, 68, 68, 0.4)"
                      : "rgba(59, 130, 246, 0.4)"
                  }`,
                  color:
                    mintingStatus === "success"
                      ? "#10b981"
                      : mintingStatus === "error" || mintingStatus === "rejected"
                      ? "#ef4444"
                      : "#3b82f6",
                  boxShadow: `0 4px 12px ${
                    mintingStatus === "success"
                      ? "rgba(16, 185, 129, 0.2)"
                      : mintingStatus === "error" || mintingStatus === "rejected"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(59, 130, 246, 0.2)"
                  }`,
                }}
              >
                {(mintingStatus === "wallet_confirm" || mintingStatus === "confirming") && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid transparent",
                        borderTop: "2px solid #3b82f6",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    <span style={{ fontSize: "11px", fontWeight: "700" }}>
                      {mintingMessage}
                    </span>
                  </div>
                )}
                {mintingStatus !== "wallet_confirm" && mintingStatus !== "confirming" && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: "700",
                      lineHeight: "1.3",
                    }}
                  >
                    {mintingMessage}
                  </p>
                )}
              </div>
            )}

            {/* Mint Button */}
            <button
              onClick={handleMintStarterCar}
              disabled={
                mintingStatus === "wallet_confirm" ||
                mintingStatus === "confirming" ||
                mintingStatus === "success" ||
                isPending
              }
              style={{
                width: "100%",
                background:
                  mintingStatus === "success"
                    ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                    : mintingStatus === "wallet_confirm" ||
                      mintingStatus === "confirming" ||
                      isPending
                    ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                cursor:
                  mintingStatus === "wallet_confirm" ||
                  mintingStatus === "confirming" ||
                  mintingStatus === "success" ||
                  isPending
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
                fontWeight: "900",
                boxShadow:
                  mintingStatus === "success"
                    ? "0 4px 16px rgba(5, 150, 105, 0.4)"
                    : mintingStatus === "wallet_confirm" ||
                      mintingStatus === "confirming" ||
                      isPending
                    ? "0 2px 8px rgba(107, 114, 128, 0.3)"
                    : "0 4px 16px rgba(16, 185, 129, 0.4)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                opacity:
                  mintingStatus === "success"
                    ? 1
                    : mintingStatus === "wallet_confirm" ||
                      mintingStatus === "confirming" ||
                      isPending
                    ? 0.7
                    : 1,
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                if (
                  mintingStatus !== "wallet_confirm" &&
                  mintingStatus !== "confirming" &&
                  mintingStatus !== "success" &&
                  !isPending
                ) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (
                  mintingStatus !== "wallet_confirm" &&
                  mintingStatus !== "confirming" &&
                  mintingStatus !== "success" &&
                  !isPending
                ) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.4)";
                }
              }}
            >
              {mintingStatus === "wallet_confirm" ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  💳 Confirm in Wallet...
                </div>
              ) : mintingStatus === "confirming" ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  ⏳ Confirming on Blockchain...
                </div>
              ) : mintingStatus === "success" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid transparent",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  🎮 Redirecting...
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  🚗 Mint Starter Racer
                </div>
              )}
            </button>

            {/* Info Text */}
            <p
              style={{
                marginTop: "10px",
                fontSize: "10px",
                opacity: 0.7,
                lineHeight: "1.3",
                textAlign: "center",
              }}
            >
              Receive a unique NFT to race, compete in tournaments, and earn rewards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {currentView !== "racing" && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.3)",
              padding: "8px 12px",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => {
                setCurrentView("menu");
                setActiveTournamentId(null);
              }}
              style={{
                background:
                  currentView === "menu"
                    ? "linear-gradient(45deg, #ff6b6b, #ffd700)"
                    : "transparent",
                color: currentView === "menu" ? "#000" : "#fff",
                border:
                  currentView === "menu"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "menu"
                    ? "0 4px 15px rgba(255,107,107,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "menu") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "menu") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              🏎️ Race
            </button>

            <button
              onClick={() => setCurrentView("tournament")}
              style={{
                background:
                  currentView === "tournament"
                    ? "linear-gradient(45deg, #8b5cf6, #06b6d4)"
                    : "transparent",
                color: currentView === "tournament" ? "#000" : "#fff",
                border:
                  currentView === "tournament"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "tournament"
                    ? "0 4px 15px rgba(139,92,246,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "tournament") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "tournament") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              🏆 Tournaments
            </button>

            <button
              onClick={() => setCurrentView("leaderboard")}
              style={{
                background:
                  currentView === "leaderboard"
                    ? "linear-gradient(45deg, #10b981, #ffd700)"
                    : "transparent",
                color: currentView === "leaderboard" ? "#000" : "#fff",
                border:
                  currentView === "leaderboard"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "leaderboard"
                    ? "0 4px 15px rgba(16,185,129,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "leaderboard") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "leaderboard") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              📊 Leaderboard
            </button>
          </div>

          <ConnectButton />
        </div>
      )}

      {currentView === "menu" && (
        <EnhancedCarRaceGame
          onNavigateToTournaments={handleNavigateToTournaments}
          onNavigateToMenu={handleNavigateToMenu}
        />
      )}

      {currentView === "racing" && (
        <EnhancedCarRaceGame
          activeTournamentId={activeTournamentId}
          onTournamentCompleted={handleTournamentCompleted}
          onNavigateToTournaments={handleNavigateToTournaments}
          onNavigateToMenu={handleNavigateToMenu}
        />
      )}

      {currentView === "tournament" && (
        <TournamentLobby
          onStartRace={handleStartRace}
          onClose={() => setCurrentView("menu")}
          selectedCarId={selectedCar?.id}
          completedTournamentsFromApp={completedTournaments}
        />
      )}

      {currentView === "leaderboard" && (
        <Leaderboard onClose={() => setCurrentView("menu")} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }

            @keyframes glow {
              0% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3)); }
              100% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6)); }
            }

            @keyframes pulse {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.2; }
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .feature-card {
              animation: slideUp 0.6s ease-out forwards;
            }

            .feature-card:nth-child(1) {
              animation-delay: 0.1s;
            }

            .feature-card:nth-child(2) {
              animation-delay: 0.2s;
            }

            .feature-card:nth-child(3) {
              animation-delay: 0.3s;
            }
          `}
        </style>
        <GameWrapper />
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;

# PushChain Racing Game - Universal App Edition 🌐

A thrilling 3D car racing game built as a **Universal App** on Push Chain - Play from ANY blockchain!

## Table of Contents

1. [What Makes This a Universal App?](#-what-makes-this-a-universal-app)
2. [Quick Start](#quick-start)
3. [Game Features](#-game-features)
4. [Deployment Guide](#deployment-guide)
5. [Universal App Integration](#universal-app-integration)
6. [Troubleshooting](#troubleshooting)
7. [Support & Resources](#support--resources)

## 🚀 What Makes This a Universal App?

This game leverages **Push Chain's Universal App technology**, enabling:

- **🌍 Cross-Chain Accessibility**: Play from Ethereum, Solana, Polygon, Base, or any supported chain
- **💫 No Network Switching**: Users don't need to switch networks or hold PC tokens
- **🔐 Universal Accounts**: Single account works across all chains
- **⚡ Seamless Transactions**: Gas fees can be paid with tokens from your origin chain
- **🎮 True Interoperability**: Built for the multi-chain future

For complete game documentation, see [GAME_DOCUMENTATION.md](./GAME_DOCUMENTATION.md)

## Quick Start

This guide will help you get the PushChain Racing Game running locally in under 10 minutes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **MetaMask** browser extension - [Install here](https://metamask.io/) or Rabby wallet (recommended for smooth UX)
- **OR** Any wallet from any chain - Phantom (Solana), Coinbase Wallet, etc.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd pushchain-racer-game
```

Set up .env file with private key (optional for contract redeployment)

```bash
# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"

# Push Chain Donut Testnet Configuration
PUSH_RPC_URL=https://evm.rpc-testnet-donut-node1.push.org
PUSH_CHAIN_ID=42101

# Contract Addresses - Update these after deployment
VITE_RACING_CONTRACT_ADDRESS="racing_contract_address"
VITE_RACING_TOKEN_ADDRESS="token_contract_address"
VITE_TOURNAMENTS_CONTRACT_ADDRESS="tournament_contract_address"

# Private key for contract deployment (no 0x prefix)
PRIVATE_KEY="your_private_key"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React + TypeScript + Vite
- Push Chain SDK (`@pushchain/core`, `@pushchain/ui-kit`)
- Hardhat for smart contracts
- Web3 libraries (Wagmi, Viem)
- Three.js for 3D graphics

### Step 3: Understand the Two Connection Modes

#### Option A: Universal Wallet (Recommended) 🌐
- **Connect from ANY chain** - Ethereum, Solana, Polygon, Base, etc.
- **No network switching required**
- Click "Universal Wallet" button on homepage
- Transactions are automatically routed through Push Chain

#### Option B: Direct Push Chain Connection
- **Traditional EVM wallet connection**
- Add Push Chain Donut Testnet to MetaMask/Rabby:

**Network Details:**
- Network Name: `Push Chain Donut Testnet`
- RPC URL: `https://evm.rpc-testnet-donut-node1.push.org`
- Chain ID: `42101`
- Currency Symbol: `PC`
- Block Explorer: `https://donut.push.network`

### Step 4: Get Test Tokens

**For Universal Wallet Users:**
- No PC tokens needed! Use tokens from your origin chain
- Gas fees handled automatically

**For Direct Connection Users:**
1. Visit [Push Chain Faucet](https://faucet.push.org/)
2. Request test PC tokens for your wallet address
3. You'll need these tokens to interact with game contracts

### Step 5: Deploy Contracts (Optional)

If you want to deploy fresh contracts:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Push Chain Donut Testnet
npx hardhat run scripts/deploy-contracts.js --network pushDonut
```

**Note:** The game is already configured with pre-deployed contracts. The deployment script automatically updates the .env file.

### Step 6: Start the Development Server

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Step 7: Connect Your Wallet

**Universal Wallet Mode (Recommended):**
1. Open the game in your browser
2. Click "Universal Wallet" button
3. Choose your wallet from ANY chain
4. Sign the connection request
5. Start playing immediately!

**Direct Connection Mode:**
1. Click "Connect Wallet"
2. Select MetaMask/Rabby
3. Approve the connection
4. It will auto-connect to Push Chain or request network addition

### Step 8: Start Playing

1. **Mint your first car** - Click "Mint Starter Racer" on welcome page (0.01 PC)
2. **Enter a race** - Go to "Main Menu" and click "Start Race"
3. **Earn rewards** - Complete races to earn RACE tokens and XP
4. **Join tournaments** - Compete for PC prizes
5. **Collect & breed cars** - Build your NFT garage

## 🎮 Game Features

### Core Gameplay
- **3D Racing**: Immersive Three.js-powered racing experience
- **NFT Cars**: Collect unique racing cars with different stats
- **Car Breeding**: Combine cars to create hybrid racers
- **Tournaments**: Compete against players worldwide
- **Leaderboard**: Climb the global rankings
- **RACE Tokens**: Earn rewards for your performance

### Universal App Benefits
- ✅ **Multi-Chain Access**: Play from your preferred blockchain
- ✅ **No Token Swapping**: Use your native chain tokens
- ✅ **Unified Experience**: Same account across all chains
- ✅ **Low Friction**: No complex wallet configurations
- ✅ **Future-Proof**: Built for web3 interoperability

## Troubleshooting

### Common Issues

**Universal Wallet Not Connecting:**
- Ensure you're using a supported wallet
- Check your internet connection
- Try refreshing the page
- Clear browser cache

**"Wrong Network" Error:**
- Switch to Push Chain Donut Testnet in your wallet
- Or use Universal Wallet mode for automatic routing
- Refresh the page

**Transaction Fails:**
- Ensure you have enough PC for gas fees (Direct mode)
- Or ensure you have tokens in your origin chain (Universal mode)
- Try increasing gas limit

**Game Won't Load:**
- Clear browser cache
- Disable ad blockers
- Try a different browser (Chrome/Firefox recommended)

**Can't Connect Wallet:**
- Update wallet extension to latest version
- Check if wallet is unlocked
- Try refreshing the page

### Network Configuration Issues

If you can't connect to Push Chain Donut Testnet:

1. Manually add the network in MetaMask/Rabby:
   - Settings → Networks → Add Network
   - Use the network details from Step 3

2. Import the network configuration:
   ```javascript
   {
     "chainId": "0xa475", // 42101 in hex
     "chainName": "Push Chain Donut Testnet",
     "rpcUrls": ["https://evm.rpc-testnet-donut-node1.push.org"],
     "nativeCurrency": {
       "name": "PC",
       "symbol": "PC",
       "decimals": 18
     },
     "blockExplorerUrls": ["https://donut.push.network"]
   }
   ```

## Advanced Setup

### Running Tests

```bash
# Run contract tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Contract Verification

To verify contracts on Push Chain explorer:

```bash
npx hardhat verify --network pushDonut <CONTRACT_ADDRESS>
```

## Universal App Architecture

```
User (Any Chain: Ethereum, Solana, Polygon, etc.)
          ↓
Push Chain SDK (Universal Layer)
  - Universal Accounts
  - Cross-chain Transaction Routing
  - Automatic Gas Handling
          ↓
Smart Contracts (Push Chain Donut Testnet)
  - Racing Contract (NFT minting, racing logic)
  - Token Contract (RACE tokens)
  - Tournament Contract (competitions)
```

### Key Technologies

- **Frontend**: React + TypeScript + Vite
- **Universal App**: Push Chain SDK (`@pushchain/core`, `@pushchain/ui-kit`)
- **Smart Contracts**: Solidity contracts on Push Chain
- **Web3 Integration**: Wagmi + Viem for blockchain interaction
- **3D Graphics**: Three.js for racing visualization
- **Wallet Connect**: Multi-wallet support

### Universal App Integration

The game uses two main hooks:

1. **`usePushChainUniversal`**: Access universal wallet features
   - `executeUniversalTransaction()`: Cross-chain transactions
   - `getUniversalAccount()`: Get universal address
   - `signMessage()`: Sign with universal signer

2. **`useRacingContract`**: Interact with game contracts
   - Automatically uses universal account when available
   - Falls back to direct connection

---

## Deployment Guide

### Prerequisites

1. **Node.js & npm** installed (v18+ recommended)
2. **A wallet** with private key
3. **Push Chain testnet tokens** from faucet
4. **Git** (optional, for version control)

### Step 1: Get Push Chain Testnet Tokens

Visit the Push Chain faucet to get testnet tokens:
- **Faucet**: https://faucet.push.org/
- **Block Explorer**: https://donut.push.network/

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:
```env
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Push Chain Donut Testnet RPC URL
PUSH_RPC_URL=https://evm.rpc-testnet-donut-node1.push.org

# Push Chain Donut Testnet Chain ID
PUSH_CHAIN_ID=42101

# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
```

**SECURITY WARNING:** Never commit your `.env` file or share your private key!

### Step 3: Compile Contracts

Compile the smart contracts:

```bash
npx hardhat compile
```

This will compile:
- `RacingToken.sol` - ERC20 token (RACE tokens)
- `PushchainRacing.sol` - Main game contract (NFT cars & racing logic)
- `PushchainTournaments.sol` - Tournament system

### Step 4: Deploy to Push Chain Donut Testnet

Deploy all contracts:

```bash
npx hardhat run scripts/deploy-contracts.js --network pushDonut
```

The deployment script will:
1. Deploy RacingToken contract
2. Deploy PushchainRacing contract
3. Deploy PushchainTournaments contract
4. Link all contracts together
5. Set up proper permissions
6. Save deployment info to `deployment-split-contracts.json`
7. Update `.env` with contract addresses

### Step 5: Verify Deployment

After successful deployment, you should see output similar to:

```
✅ RacingToken deployed to: 0x...
✅ PushchainRacing deployed to: 0x...
✅ PushchainTournaments deployed to: 0x...

🔗 Linking contracts...
✅ Token contract linked to Racing contract
✅ Racing contract authorized to mint tokens
✅ Tournament contract linked to Racing contract
```

Check your contracts on the Push Chain block explorer: https://donut.push.network/

### Contract Features

#### RacingToken (RACE)
- ERC20 token for rewards
- Minting controlled by Racing contract
- Player token balances
- Token rewards for racing

#### PushchainRacing
- Car minting (Starter, Sport, Racing Beast)
- Race result submission with token rewards
- Staking system (100 XP/day)
- Daily rewards & challenges
- Player stats & global leaderboard
- Token integration for gameplay rewards

#### PushchainTournaments
- Tournament creation & management
- Entry fee collection
- Prize pool distribution (50%/30%/20%)
- Tournament leaderboards
- Multi-player competition

---

## Universal App Integration

### Overview

Your racing game is a **Universal App** using the Push Chain SDK. Users can interact with your game from **any blockchain** (Ethereum, Solana, Base, Polygon, etc.) without needing to switch networks or hold specific tokens.

### Key Features

#### ✅ Cross-Chain Transactions
Users from any supported chain can interact with your contracts deployed on Push Chain without switching networks.

#### ✅ Universal Account
Each user gets a universal account address that works across all chains.

#### ✅ Flexible Payment
Users can pay gas fees with tokens from their origin chain - no need to hold PC tokens.

#### ✅ Seamless UX
No network switching prompts or confusing wallet interactions.

### Architecture

```
User (Any Chain: Ethereum, Solana, Polygon, etc.)
          ↓
Push Chain SDK (Universal Layer)
  - Universal Accounts
  - Cross-chain Transaction Routing
  - Automatic Gas Handling
          ↓
Smart Contracts (Push Chain Donut Testnet)
  - Racing Contract (NFT minting, racing logic)
  - Token Contract (RACE tokens)
  - Tournament Contract (competitions)
```

### For Developers

#### Execute a Universal Transaction
```typescript
import { usePushChainUniversal } from '../hooks/usePushChainUniversal';

function MyComponent() {
  const { executeUniversalTransaction } = usePushChainUniversal();

  const mintCar = async () => {
    const txHash = await executeUniversalTransaction({
      to: RACING_CONTRACT_ADDRESS,
      data: encodedFunctionCall,
      value: parseEther('0.01')
    });
  };
}
```

#### Get Universal Account
```typescript
const { getUniversalAccount } = usePushChainUniversal();
const universalAddress = getUniversalAccount();
```

#### Check Connection Status
```typescript
const { isConnected, isInitialized, wallet } = usePushChainUniversal();
```

### Integration Files

#### New Dependencies
```json
"@pushchain/core": "^2.0.19",
"@pushchain/ui-kit": "^2.0.9"
```

#### Key Files
- `/src/providers/PushChainProvider.tsx` - Wraps app with Universal Wallet functionality
- `/src/hooks/usePushChainUniversal.ts` - Custom hook for Push Chain features
- `/src/providers/Web3Provider.tsx` - Integrated Push Chain provider
- `/src/components/ConnectButton.tsx` - Universal wallet connection UI

## Support & Resources

### Documentation
- **Full Game Guide**: See [GAME_DOCUMENTATION.md](./GAME_DOCUMENTATION.md)
- **Push Chain Docs**: https://push.org/docs
- **Knowledge Base**: https://push.org/knowledge/
- **SDK Documentation**: https://github.com/pushchain/push-chain-sdk
- **Core SDK**: https://www.npmjs.com/package/@pushchain/core
- **UI Kit**: https://www.npmjs.com/package/@pushchain/ui-kit

### Community
- **Discord**: https://discord.com/invite/pushchain
- **Telegram**: Join Project G.U.D support group
- **Explorer**: https://donut.push.network
- **Faucet**: https://faucet.push.org/

### Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify network configuration
3. Ensure you have sufficient tokens (PC or origin chain)
4. Try Universal Wallet mode for easier setup
5. Join Push Chain Discord for community support

## Competition Highlights

✅ **Functionality**: Fully functional racing game with NFTs, breeding, tournaments
✅ **Universal App**: True cross-chain accessibility from any supported blockchain
✅ **Composability**: Built with Push Chain SDK for seamless integration
✅ **Ease of Use**: No network switching, supports any wallet
✅ **Innovation**: Leverages cutting-edge Universal App technology
✅ **Design**: Modern UI with glassmorphism and smooth animations

## What's Next?

- 🎨 More car designs and rarities
- 🏆 Ranked competitive modes
- 🌍 Multi-player races
- 🎁 Achievement system
- 💎 Marketplace for car trading
- 🔥 Special event tournaments

---

Ready to race on the Universal blockchain? Let's go! 🏎️💨

**Play from ANY chain. Race on Push Chain. Win everywhere.** 🌐

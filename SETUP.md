# Multi-Blockchain Explorer Setup

This project supports both EVM (Base/Ethereum) and Solana networks with real blockchain data.

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
# EVM Network RPC Configuration (Base/Ethereum)
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.gateway.tatum.io/
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_api_key_here

# Solana Network RPC Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.gateway.tatum.io/

# Token Contract Addresses on Base
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_USDT_CONTRACT=0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2
NEXT_PUBLIC_DAI_CONTRACT=0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb
```

2. Get a Tatum API key:
   - Visit [Tatum Dashboard](https://dashboard.tatum.io/)
   - Sign up for a free account
   - Create an API key
   - Replace `your_tatum_api_key_here` with your actual API key

## Debugging

### Test RPC Connection
Visit `/test-rpc` to test your RPC connection and debug issues.

### Console Logs
The app now includes extensive console logging. Open your browser's developer tools to see:
- 🔍 Transaction fetching process
- 🌐 RPC requests and responses
- 🪙 Token balance fetching
- ❌ Error details

### Common Issues

1. **No API Key**: If you see "⚠️ No API key provided" in console, add your Tatum API key to `.env.local`

2. **RPC Errors**: If you see RPC errors, check:
   - Your internet connection
   - Tatum API key validity
   - Transaction hash format (should start with 0x)

3. **No Transaction Found**: If you see "❌ No real blockchain transaction found", the transaction doesn't exist on Base network or there's an RPC error. Check console for details.

## Features

### Multi-Blockchain Support
- **EVM Networks**: Base, Ethereum (0x addresses/transactions)
- **Solana**: Native Solana addresses and transaction signatures
- Automatic blockchain detection based on input format

### Real Blockchain Data
- Fetches real transaction data from both EVM and Solana networks
- Shows actual transaction status, gas fees, and timestamps
- Displays full wallet addresses

### Token Support

#### EVM Networks (Base/Ethereum)
- Automatically detects USDC, USDT, and DAI transactions
- Shows token balances for sender and receiver addresses
- Displays token information (name, symbol, contract address, decimals)

#### Solana Network
- Supports USDC and USDT tokens only
- Shows SOL balance and token balances
- Uses Solana mint addresses for token detection

### Token Contracts

#### Base Network
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **USDT**: `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2`
- **DAI**: `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`

#### Solana Network
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

## How It Works

1. **Transaction Lookup**: When you visit `/tx/[transactionHash]`, the app:
   - Fetches the transaction from Base network using RPC calls
   - Checks if the transaction involves any of the supported tokens
   - Retrieves token balances for both sender and receiver

2. **Token Detection**: The system automatically detects if a transaction:
   - Is sent to a token contract address
   - Involves USDC, USDT, or DAI transfers
   - Shows relevant token information

3. **Balance Display**: For each address, the app shows:
   - Current token balances (USDC, USDT, DAI)
   - Only displays tokens with non-zero balances
   - Real-time balance data from the blockchain

## RPC Methods Used

The app uses the following Base network RPC methods:
- `eth_getTransactionByHash` - Get transaction details
- `eth_getTransactionReceipt` - Get transaction status and gas usage
- `eth_getBlockByNumber` - Get block information for timestamps
- `eth_call` - Call smart contract methods for token data
- `eth_getBalance` - Get ETH balance
- `eth_blockNumber` - Get current block number

## Real Data Only

The app uses ONLY real blockchain data. If a transaction doesn't exist on Base network, it will show a 404 error. No mock data fallback.

## Rate Limiting

**IMPORTANT**: The app is rate limited to **1 API call per second** to respect Tatum API limits.

### Loading Times
- **Transaction data**: ~3 seconds
- **Token balances**: ~18 seconds (for 2 addresses)
- **Total page load**: ~24 seconds

### Why So Slow?
Each transaction page makes up to 24 API calls:
- 3 calls for transaction data
- 3 calls for token info (if applicable)
- 18 calls for token balances (9 per address)

All calls are rate limited to 1 per second to avoid hitting API limits.

### Console Monitoring
Open browser dev tools to see:
- `⏳ Rate limiting: waiting Xms before next request`
- `🪙 Fetching token balances (rate limited to 1 req/sec)`
- Progress indicators for each API call

## Development

To run the project:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Testing

You can test with real Base network transaction hashes. For example:
- Visit `/tx/0x[transactionHash]` with a real Base transaction hash
- The app will fetch and display the real transaction data
- Token balances will be shown if the addresses hold USDC, USDT, or DAI

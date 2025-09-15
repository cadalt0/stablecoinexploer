# StableCoin Explorer

A user-friendly blockchain explorer designed for merchants and non-web3 users to easily track and view stablecoin payment transaction history.

## 🎯 Purpose

Built for merchants and everyday users who need to:
- Track stablecoin payments without technical blockchain knowledge
- View transaction history in a familiar, payment-focused interface
- Monitor USDC, USDT, and DAI transactions across multiple networks
- Verify payments and transaction status easily

## ✨ Features

### Multi-Blockchain Support
- **EVM Networks**: Base, Ethereum, Polygon
- **Solana**: Native support for Solana stablecoin transactions

### Supported Stablecoins
- **USDC** (USD Coin)
- **USDT** (Tether USD) 
- **DAI** (Dai Stablecoin)

### User-Friendly Interface
- Clean, payment-focused design
- Real-time transaction tracking
- Simple search by address or transaction hash
- Mobile-responsive design
- Dark/light theme support

### Key Capabilities
- 🔍 **Easy Search**: Enter any address or transaction hash
- 📊 **Transaction Details**: View complete transaction information
- 💰 **Balance Tracking**: Monitor wallet balances
- 🚀 **Fast Loading**: Optimized for quick access
- 📱 **Mobile Ready**: Works on all devices

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/cadalt0/stablecoinexploer.git
   cd stablecoinexploer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Tatum API key to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Required Environment Variables
```env
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.gateway.tatum.io/
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.gateway.tatum.io/
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_api_key_here
```

### Getting API Keys
1. Visit [Tatum Dashboard](https://dashboard.tatum.io/)
2. Create a free account
3. Generate an API key
4. Add it to your `.env.local` file

## 📖 How to Use

### For Merchants
1. **Track Customer Payments**: Enter customer wallet addresses to see their transaction history
2. **Verify Transactions**: Search transaction hashes to confirm payments
3. **Monitor Balances**: Check wallet balances for USDC, USDT, and DAI

### For Users
1. **Search Your Wallet**: Enter your wallet address to see all stablecoin transactions
2. **Find Specific Transactions**: Search by transaction hash to get detailed information
3. **Check Balances**: View your current stablecoin holdings

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Blockchain**: Tatum API for Base & Solana
- **Deployment**: Vercel-ready

## 📱 Supported Networks

- **Base Network** (Primary)
- **Ethereum Mainnet**
- **Solana Mainnet**

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/cadalt0/stablecoinexploer/issues) page
2. Create a new issue with detailed information
3. Contact us for merchant-specific support

---

**Built for merchants, by developers who understand payment workflows.**

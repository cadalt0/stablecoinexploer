// Real blockchain data service for stablecoin explorer
export interface Transaction {
  id: string
  sender: string
  receiver: string
  coinType: string
  amount: string
  timestamp: string
  status: "success" | "pending" | "failed"
  gasFee: string
  blockNumber: string
  hash?: string
  value?: string
  gasLimit?: string
  gasUsed?: string
  nonce?: number
  input?: string
  tokenInfo?: {
    contract: string
    symbol: string
    name: string
    decimals: number
  }
}

export interface TokenBalance {
  symbol: string
  name: string
  contract: string
  balance: string
  decimals: number
}

export interface Address {
  address: string
  balance: string
  transactionCount: number
  firstSeen: string
  lastSeen: string
  tokens: Array<{
    symbol: string
    balance: string
    value: string
  }>
}

// Mock data removed - using only real blockchain data

// API functions - now using real blockchain data only
export function getAllTransactions(): Transaction[] {
  // This would need to be implemented with real blockchain data
  // For now, return empty array as we're focusing on individual transaction lookup
  return []
}

export function getTransactionsByAddress(address: string): Transaction[] {
  // This would need to be implemented with real blockchain data
  // For now, return empty array as we're focusing on individual transaction lookup
  return []
}

export async function searchTransactionOrAddress(query: string): Promise<{
  type: "transaction" | "address" | null
  data: Transaction | Address | null
}> {
  // Check if it's a transaction hash
  const transaction = await getTransactionById(query)
  if (transaction) {
    return { type: "transaction", data: transaction }
  }

  // Check if it's an address
  const addressInfo = await getAddressInfo(query)
  if (addressInfo) {
    return { type: "address", data: addressInfo }
  }

  return { type: null, data: null }
}

export const coinIcons: Record<string, string> = {
  USDT: "₮",
  USDC: "◉",
  DAI: "◈",
}

export const statusConfig = {
  success: { icon: "CheckCircle", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
  pending: { icon: "Clock", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
  failed: { icon: "XCircle", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" },
}

// Real blockchain data functions
import { baseRPCService, TOKEN_CONTRACTS } from './rpc-service'
import { solanaRPCService, SOLANA_TOKEN_MINTS } from './solana-rpc-service'
import { detectBlockchainType } from './blockchain-detector'

// Convert hex to decimal
function hexToDecimal(hex: string): string {
  try {
    if (!hex) return "0"
    return parseInt(hex, 16).toString()
  } catch (error) {
    console.error('❌ Error converting hex to decimal:', error, 'hex:', hex)
    return "0"
  }
}

// Convert wei to ETH
function weiToEth(wei: string): string {
  try {
    if (!wei) return "0.000000"
    return (parseInt(wei, 16) / Math.pow(10, 18)).toFixed(6)
  } catch (error) {
    console.error('❌ Error converting wei to ETH:', error, 'wei:', wei)
    return "0.000000"
  }
}

// Convert token amount using decimals
function formatTokenAmount(amount: string, decimals: number): string {
  return (parseInt(amount, 16) / Math.pow(10, decimals)).toFixed(6)
}

// Get transaction status from receipt
function getTransactionStatus(receipt: any): "success" | "pending" | "failed" {
  if (!receipt) return "pending"
  return receipt.status === "0x1" ? "success" : "failed"
}

// Format timestamp from block
function formatTimestamp(block: any): string {
  if (!block || !block.timestamp) {
    console.log('⚠️ No block or timestamp available, using current time')
    return new Date().toLocaleString()
  }
  
  try {
    const timestamp = parseInt(block.timestamp, 16) * 1000
    return new Date(timestamp).toLocaleString()
  } catch (error) {
    console.error('❌ Error parsing timestamp:', error, 'block:', block)
    return new Date().toLocaleString()
  }
}

// Real blockchain data functions
export async function getRealTransactionById(txId: string): Promise<Transaction | null> {
  try {
    console.log('🌐 getRealTransactionById called with:', txId)
    
    const blockchainType = detectBlockchainType(txId)
    console.log('🔍 Detected blockchain type:', blockchainType)
    
    if (blockchainType === 'solana') {
      return await getSolanaTransaction(txId)
    } else {
      return await getEVMTransaction(txId)
    }
  } catch (error) {
    console.error('❌ Error fetching real transaction:', error)
    return null
  }
}

async function getEVMTransaction(txId: string): Promise<Transaction | null> {
  try {
    const result = await baseRPCService.checkTransactionTokens(txId)
    console.log('🔍 EVM RPC result:', result)
    
    if (!result) {
      console.log('❌ No result from EVM RPC service')
      return null
    }

    const { transaction, receipt, tokenInfo, transferAmount, actualSender, actualReceiver } = result
    console.log('📊 Processing EVM transaction data:', { transaction, receipt, tokenInfo, transferAmount, actualSender, actualReceiver })
    
    let block: any = null
    try {
      block = await baseRPCService.getBlock((receipt as any).blockNumber)
      console.log('📦 Block data:', block)
    } catch (error) {
      console.error('❌ Error fetching block:', error)
      // Continue without block data
    }
    
    // Only show token amounts, not ETH
    let coinType = ""
    let amount = ""
    
    if (tokenInfo) {
      coinType = tokenInfo.symbol
      // Always show the transfer amount, even if it's 0
      amount = transferAmount || "0"
      
      // If we still don't have an amount, show a placeholder
      if (amount === "0" && transferAmount === "0") {
        amount = "0.000000" // Show placeholder for token transactions
      }
      
      console.log('🪙 Final EVM token amount:', { 
        coinType, 
        amount, 
        transferAmount, 
        isZero: parseFloat(transferAmount || "0") === 0,
        tokenInfo: tokenInfo,
        hasIcon: coinIcons[coinType] !== undefined,
        availableIcons: Object.keys(coinIcons)
      })
    } else {
      // No token info means no token transfer
      coinType = ""
      amount = ""
      console.log('❌ No EVM token info found')
    }

    // Calculate gas fee safely
    let gasFee = "0.000000"
    try {
      if ((receipt as any).gasUsed && (transaction as any).gasPrice) {
        const gasUsed = parseInt((receipt as any).gasUsed, 16)
        const gasPrice = parseInt((transaction as any).gasPrice, 16)
        gasFee = weiToEth((gasUsed * gasPrice).toString(16))
      }
    } catch (error) {
      console.error('❌ Error calculating gas fee:', error)
    }

    const processedTx = {
      id: (transaction as any).hash,
      hash: (transaction as any).hash,
      sender: actualSender || (transaction as any).from,
      receiver: actualReceiver || (transaction as any).to || "",
      coinType,
      amount,
      timestamp: formatTimestamp(block),
      status: getTransactionStatus(receipt),
      gasFee,
      blockNumber: hexToDecimal((receipt as any).blockNumber),
      value: (transaction as any).value,
      gasLimit: (transaction as any).gas,
      gasUsed: (receipt as any).gasUsed,
      nonce: parseInt((transaction as any).nonce, 16),
      input: (transaction as any).input,
      tokenInfo: tokenInfo || undefined
    }
    
    console.log('✅ Processed EVM transaction:', processedTx)
    return processedTx
  } catch (error) {
    console.error('❌ Error fetching EVM transaction:', error)
    return null
  }
}

async function getSolanaTransaction(signature: string): Promise<Transaction | null> {
  try {
    const { tokenChanges, sender, receiver, tokenInfo } = await solanaRPCService.getTransactionTokenChanges(signature)
    
    if (!tokenChanges || tokenChanges.length === 0) {
      console.log('❌ No Solana token transaction found')
      return null
    }

    console.log('✅ Real Solana transaction found:', {
      signature,
      tokenChanges,
      sender,
      receiver,
      tokenInfo
    })

    // Get transaction details for timestamp and status
    const transaction = await solanaRPCService.getTransaction(signature)
    const timestamp = transaction?.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : new Date().toISOString()
    const status = transaction?.meta?.err ? 'failed' : 'success'

    // Format timestamp
    const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

    // Get the main token change (largest absolute change)
    const mainChange = tokenChanges.reduce((max, change) => 
      Math.abs(change.change) > Math.abs(max.change) ? change : max
    )

    const processedTx = {
      id: signature,
      hash: signature,
      sender: typeof sender === 'string' ? sender : (sender?.toString() || 'Unknown'),
      receiver: typeof receiver === 'string' ? receiver : (receiver?.toString() || 'Unknown'),
      coinType: tokenInfo?.symbol || mainChange.symbol,
      amount: tokenInfo?.amount || Math.abs(mainChange.change).toString(),
      timestamp: formattedTimestamp,
      status: status as 'success' | 'pending' | 'failed',
      gasFee: transaction?.meta?.fee ? (transaction.meta.fee / 1e9).toFixed(6) + ' SOL' : '0.000000 SOL',
      blockNumber: transaction?.slot?.toString() || '0',
      value: '0',
      gasLimit: '0',
      gasUsed: '0',
      nonce: 0,
      input: '',
      tokenInfo: tokenInfo ? {
        contract: tokenInfo.mint,
        symbol: tokenInfo.symbol,
        name: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        transferAmount: tokenInfo.amount
      } : undefined
    }
    
    console.log('✅ Processed Solana transaction:', processedTx)
    return processedTx
  } catch (error) {
    console.error('❌ Error fetching Solana transaction:', error)
    return null
  }
}

export async function getRealAddressTokenBalances(address: string): Promise<TokenBalance[]> {
  try {
    return await baseRPCService.getAddressTokenBalances(address)
  } catch (error) {
    console.error('Error fetching token balances:', error)
    return []
  }
}

// Real blockchain data only - no mock fallback
export async function getTransactionById(id: string): Promise<Transaction | null> {
  console.log('🔍 getTransactionById called with:', id)
  console.log('🔧 Environment variables:', {
    hasRpcUrl: !!process.env.NEXT_PUBLIC_BASE_RPC_URL,
    hasApiKey: !!process.env.NEXT_PUBLIC_TATUM_API_KEY,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL
  })
  
  try {
    console.log('🌐 Calling getRealTransactionById...')
    const realTx = await getRealTransactionById(id)
    console.log('📊 getRealTransactionById result:', realTx)
    
    if (realTx) {
      console.log('✅ Real blockchain data fetched successfully:', realTx)
      return realTx
    } else {
      console.log('❌ No real blockchain data found for transaction:', id)
      return null
    }
  } catch (error) {
    console.error('❌ Real data fetch failed:', error)
    console.error('❌ Error details:', error)
    return null
  }
}

export async function getAddressInfo(address: string): Promise<Address | null> {
  try {
    const blockchainType = detectBlockchainType(address)
    
    if (blockchainType === 'solana') {
      return await getSolanaAddressInfo(address)
    } else {
      return await getEVMAddressInfo(address)
    }
  } catch (error) {
    console.error('Error fetching real address info:', error)
    return null
  }
}

async function getEVMAddressInfo(address: string): Promise<Address | null> {
  try {
    // Get real token balances
    const tokenBalances = await getRealAddressTokenBalances(address)
    
    // Get ETH balance
    const ethBalance = await baseRPCService.getBalance(address)
    const ethBalanceFormatted = weiToEth(ethBalance as string)
    
    // Convert token balances to the expected format
    const tokens = tokenBalances.map(token => ({
      symbol: token.symbol,
      balance: token.balance,
      value: `$${token.balance}` // Simplified - would need price data
    }))
    
    // Calculate total balance (ETH + tokens)
    const totalTokenValue = tokenBalances.reduce((sum, token) => {
      return sum + parseFloat(token.balance)
    }, 0)
    
    const totalBalance = parseFloat(ethBalanceFormatted) + totalTokenValue
    
    console.log('💰 EVM Balance calculation:', {
      address,
      ethBalance: ethBalanceFormatted,
      tokenBalances: tokenBalances.map(t => ({ symbol: t.symbol, balance: t.balance })),
      totalTokenValue,
      totalBalance,
      finalBalance: totalBalance > 0 ? `$${totalBalance.toFixed(6)}` : `$${ethBalanceFormatted}`
    })
    
    return {
      address,
      balance: totalBalance > 0 ? `$${totalBalance.toFixed(6)}` : `$${ethBalanceFormatted}`,
      transactionCount: 0, // Would need to fetch from API
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      tokens
    }
  } catch (error) {
    console.error('Error fetching EVM address info:', error)
    return null
  }
}

async function getSolanaAddressInfo(address: string): Promise<Address | null> {
  try {
    // Get token balances (USDC and USDT only)
    const tokenBalances = await solanaRPCService.getTokenBalances(address)
    
    // Convert token balances to the expected format
    const tokens = tokenBalances.map(token => ({
      symbol: token.symbol,
      balance: token.balance,
      value: `$${token.balance}` // Simplified - would need price data
    }))
    
    // Calculate total balance (only tokens, no SOL)
    const totalTokenValue = tokenBalances.reduce((sum, token) => {
      return sum + parseFloat(token.balance || '0')
    }, 0)
    
    console.log('💰 Solana Balance calculation:', {
      address,
      tokenBalances: tokenBalances.map(t => ({ symbol: t.symbol, balance: t.balance })),
      totalTokenValue,
      finalBalance: totalTokenValue > 0 ? `$${totalTokenValue.toFixed(6)}` : 'No token balance'
    })
    
    return {
      address,
      balance: totalTokenValue > 0 ? `$${totalTokenValue.toFixed(6)}` : 'No token balance',
      transactionCount: 0, // Would need to fetch from API
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      tokens
    }
  } catch (error) {
    console.error('Error fetching Solana address info:', error)
    return null
  }
}

// Solana RPC service for stablecoin explorer
import { TOKEN_CONTRACTS } from './rpc-service'

// Solana token mint addresses
export const SOLANA_TOKEN_MINTS = {
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
}

export class SolanaRPCService {
  private baseUrl: string
  private apiKey: string
  private lastRequestTime = 0
  private readonly rateLimitMs = 1000 // 1 second between requests

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://solana-mainnet.gateway.tatum.io/'
    this.apiKey = process.env.NEXT_PUBLIC_TATUM_API_KEY || ''
    
    console.log('🔗 Solana RPC Service Config:', {
      SOLANA_RPC_URL: this.baseUrl,
      HAS_API_KEY: !!this.apiKey,
      API_KEY_PREFIX: this.apiKey ? `t-${this.apiKey.slice(0, 8)}...` : 'None'
    })
  }

  private async rateLimit() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.rateLimitMs) {
      const waitTime = this.rateLimitMs - timeSinceLastRequest
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }

  private async makeRequest(method: string, params: any[] = []) {
    await this.rateLimit()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey
    }

    console.log('📡 Making Solana RPC request:', { method, params })

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    })

    if (!response.ok) {
      throw new Error(`Solana RPC request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`Solana RPC error: ${data.error.message}`)
    }

    console.log('📡 Solana RPC response:', { method, result: data.result })
    return data.result
  }

  // Get account info for an address
  async getAccountInfo(address: string) {
    return this.makeRequest('getAccountInfo', [address])
  }

  // Get balance for an address
  async getBalance(address: string) {
    const result = await this.makeRequest('getBalance', [address])
    console.log('🔍 Solana getBalance result:', result)
    return result
  }

  // Get token account balance
  async getTokenAccountBalance(tokenAccount: string) {
    return this.makeRequest('getTokenAccountBalance', [tokenAccount])
  }

  // Get token accounts by owner
  async getTokenAccountsByOwner(owner: string, programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
    console.log('🔍 getTokenAccountsByOwner params:', {
      owner,
      programId,
      encoding: 'jsonParsed'
    })
    
    const result = await this.makeRequest('getTokenAccountsByOwner', [
      owner,
      { programId },
      { encoding: 'jsonParsed' }
    ])
    
    console.log('🔍 getTokenAccountsByOwner full result:', result)
    return result
  }

  // Get transaction by signature with parsed token data
  async getTransaction(signature: string) {
    return this.makeRequest('getTransaction', [
      signature,
      { 
        encoding: 'jsonParsed', 
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      }
    ])
  }

  // Get signatures for address
  async getSignaturesForAddress(address: string, limit: number = 10) {
    return this.makeRequest('getSignaturesForAddress', [address, { limit }])
  }

  // Get token supply
  async getTokenSupply(mintAddress: string) {
    return this.makeRequest('getTokenSupply', [mintAddress])
  }

  // Check if address is a valid Solana address
  isValidSolanaAddress(address: string): boolean {
    try {
      // Basic Solana address validation (base58, 32-44 characters)
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
      return base58Regex.test(address) && address.length >= 32 && address.length <= 44
    } catch {
      return false
    }
  }

  // Check if signature is a valid Solana transaction signature
  isValidSolanaSignature(signature: string): boolean {
    try {
      // Solana signatures are base58 encoded, typically 88 characters
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/
      return base58Regex.test(signature) && signature.length === 88
    } catch {
      return false
    }
  }

  // Get token balances for USDC and USDT
  async getTokenBalances(address: string) {
    try {
      console.log('🪙 Fetching Solana token balances for', address)
      
      // First, let's verify the address is valid
      if (!this.isValidSolanaAddress(address)) {
        console.error('❌ Invalid Solana address format:', address)
        return []
      }
      
      // Skip account info check as it's causing base58 encoding issues
      console.log('🔍 Skipping account info check due to base58 encoding issues')
      
      const tokenAccounts = await this.getTokenAccountsByOwner(address)
      console.log('🔍 getTokenAccountsByOwner response:', tokenAccounts)
      
      const balances: Array<{ symbol: string; balance: string; mint: string }> = []

      if (tokenAccounts.value && tokenAccounts.value.length > 0) {
        console.log(`📊 Found ${tokenAccounts.value.length} token accounts`)
        
        for (const account of tokenAccounts.value) {
          const parsedData = account.account.data.parsed
          const mint = parsedData.info.mint
          const amount = parsedData.info.tokenAmount.uiAmount
          const decimals = parsedData.info.tokenAmount.decimals

          console.log('🔍 Token account:', {
            mint,
            amount,
            decimals,
            isUSDC: mint === SOLANA_TOKEN_MINTS.USDC,
            isUSDT: mint === SOLANA_TOKEN_MINTS.USDT
          })

          // Check if it's USDC or USDT
          if (mint === SOLANA_TOKEN_MINTS.USDC) {
            balances.push({
              symbol: 'USDC',
              balance: amount?.toString() || '0',
              mint: SOLANA_TOKEN_MINTS.USDC
            })
            console.log('✅ Added USDC balance:', amount?.toString() || '0')
          } else if (mint === SOLANA_TOKEN_MINTS.USDT) {
            balances.push({
              symbol: 'USDT', 
              balance: amount?.toString() || '0',
              mint: SOLANA_TOKEN_MINTS.USDT
            })
            console.log('✅ Added USDT balance:', amount?.toString() || '0')
          }
        }
      } else {
        console.log('📊 No token accounts found for this address')
        console.log('🔍 This could mean:')
        console.log('  - Address has no SPL token accounts')
        console.log('  - Address is invalid or doesn\'t exist')
        console.log('  - RPC endpoint issue')
        
        // Let's try a different approach - check if we can get any account info
        console.log('🔄 Trying alternative approach...')
        
        // Try to get the account's associated token accounts for USDC and USDT specifically
        // We need to use the SPL Token Program ID, not the mint addresses
        try {
          console.log('🔄 Trying to get USDC accounts...')
          const usdcAccounts = await this.getTokenAccountsByOwner(address, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
          console.log('🔍 USDC specific accounts:', usdcAccounts)
          
          // Filter for USDC mint
          if (usdcAccounts.value && usdcAccounts.value.length > 0) {
            const usdcAccount = usdcAccounts.value.find(account => 
              account.account.data.parsed.info.mint === SOLANA_TOKEN_MINTS.USDC
            )
            if (usdcAccount) {
              const amount = usdcAccount.account.data.parsed.info.tokenAmount.uiAmount
              balances.push({
                symbol: 'USDC',
                balance: amount?.toString() || '0',
                mint: SOLANA_TOKEN_MINTS.USDC
              })
              console.log('✅ Found USDC account:', amount?.toString() || '0')
            }
          }
          
          console.log('🔄 Trying to get USDT accounts...')
          const usdtAccounts = await this.getTokenAccountsByOwner(address, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
          console.log('🔍 USDT specific accounts:', usdtAccounts)
          
          // Filter for USDT mint
          if (usdtAccounts.value && usdtAccounts.value.length > 0) {
            const usdtAccount = usdtAccounts.value.find(account => 
              account.account.data.parsed.info.mint === SOLANA_TOKEN_MINTS.USDT
            )
            if (usdtAccount) {
              const amount = usdtAccount.account.data.parsed.info.tokenAmount.uiAmount
              balances.push({
                symbol: 'USDT',
                balance: amount?.toString() || '0',
                mint: SOLANA_TOKEN_MINTS.USDT
              })
              console.log('✅ Found USDT account:', amount?.toString() || '0')
            }
          }
        } catch (error) {
          console.log('⚠️ Alternative approach failed:', error)
        }
      }

      console.log('🪙 Final Solana token balances:', balances)
      return balances
    } catch (error) {
      console.error('❌ Error fetching Solana token balances:', error)
      return []
    }
  }

  // Extract token balance changes from a transaction
  async getTransactionTokenChanges(signature: string) {
    try {
      console.log('🪙 Fetching Solana transaction token changes for', signature)
      
      const transaction = await this.getTransaction(signature)
      
      if (!transaction || !transaction.meta) {
        console.log('❌ No transaction or meta data found')
        return {
          tokenChanges: [],
          sender: null,
          receiver: null,
          tokenInfo: null
        }
      }

      const { preTokenBalances = [], postTokenBalances = [] } = transaction.meta
      const tokenChanges: Array<{
        symbol: string
        mint: string
        change: number
        fromAccount: number
        toAccount: number
      }> = []

      // Create maps for easier lookup
      const preBalances = new Map()
      const postBalances = new Map()

      preTokenBalances.forEach((balance: any) => {
        if (balance.mint === SOLANA_TOKEN_MINTS.USDC || balance.mint === SOLANA_TOKEN_MINTS.USDT) {
          preBalances.set(balance.accountIndex, balance.uiTokenAmount.uiAmount || 0)
        }
      })

      postTokenBalances.forEach((balance: any) => {
        if (balance.mint === SOLANA_TOKEN_MINTS.USDC || balance.mint === SOLANA_TOKEN_MINTS.USDT) {
          postBalances.set(balance.accountIndex, balance.uiTokenAmount.uiAmount || 0)
        }
      })

      // Calculate changes
      for (const [accountIndex, preAmount] of preBalances) {
        const postAmount = postBalances.get(accountIndex) || 0
        const change = postAmount - preAmount

        if (Math.abs(change) > 0.000001) { // Only include significant changes
          // Find the mint for this account
          const balanceEntry = postTokenBalances.find((b: any) => b.accountIndex === accountIndex)
          const mint = balanceEntry?.mint

          if (mint === SOLANA_TOKEN_MINTS.USDC || mint === SOLANA_TOKEN_MINTS.USDT) {
            tokenChanges.push({
              symbol: mint === SOLANA_TOKEN_MINTS.USDC ? 'USDC' : 'USDT',
              mint,
              change,
              fromAccount: change < 0 ? accountIndex : -1,
              toAccount: change > 0 ? accountIndex : -1
            })
          }
        }
      }

      // Determine sender and receiver from account changes
      let sender = null
      let receiver = null
      let tokenInfo = null

      if (tokenChanges.length > 0) {
        // Get the accounts from the transaction
        const accounts = transaction.transaction?.message?.accountKeys || []
        
        console.log('🔍 Solana accounts:', accounts)
        console.log('🔍 Token changes for account extraction:', tokenChanges)
        
        // Find the main token change (largest absolute change)
        const mainChange = tokenChanges.reduce((max, change) => 
          Math.abs(change.change) > Math.abs(max.change) ? change : max
        )

        // Find sender (account that lost tokens)
        const senderChange = tokenChanges.find(change => change.change < 0)
        if (senderChange && senderChange.fromAccount >= 0) {
          const senderAccount = accounts[senderChange.fromAccount]
          // Extract the actual address string from the account object
          sender = typeof senderAccount === 'string' ? senderAccount : (senderAccount?.pubkey || senderAccount?.toString() || 'Unknown')
          console.log('📤 Found sender from senderChange:', sender, 'at index', senderChange.fromAccount)
        }

        // Find receiver (account that gained tokens)
        const receiverChange = tokenChanges.find(change => change.change > 0)
        if (receiverChange && receiverChange.toAccount >= 0) {
          const receiverAccount = accounts[receiverChange.toAccount]
          // Extract the actual address string from the account object
          receiver = typeof receiverAccount === 'string' ? receiverAccount : (receiverAccount?.pubkey || receiverAccount?.toString() || 'Unknown')
          console.log('📥 Found receiver from receiverChange:', receiver, 'at index', receiverChange.toAccount)
        }

        // If we still don't have sender/receiver, try to find them from the main change
        if (!sender && mainChange.change < 0 && mainChange.fromAccount >= 0) {
          const senderAccount = accounts[mainChange.fromAccount]
          // Extract the actual address string from the account object
          sender = typeof senderAccount === 'string' ? senderAccount : (senderAccount?.pubkey || senderAccount?.toString() || 'Unknown')
          console.log('📤 Found sender from mainChange:', sender, 'at index', mainChange.fromAccount)
        }
        if (!receiver && mainChange.change > 0 && mainChange.toAccount >= 0) {
          const receiverAccount = accounts[mainChange.toAccount]
          // Extract the actual address string from the account object
          receiver = typeof receiverAccount === 'string' ? receiverAccount : (receiverAccount?.pubkey || receiverAccount?.toString() || 'Unknown')
          console.log('📥 Found receiver from mainChange:', receiver, 'at index', mainChange.toAccount)
        }

        tokenInfo = {
          symbol: mainChange.symbol,
          mint: mainChange.mint,
          amount: Math.abs(mainChange.change).toString(),
          decimals: 6 // USDC and USDT both use 6 decimals on Solana
        }
      }

      console.log('🪙 Solana token changes:', {
        tokenChanges,
        sender,
        receiver,
        tokenInfo
      })

      return {
        tokenChanges,
        sender: typeof sender === 'string' ? sender : (sender?.pubkey || sender?.toString() || 'Unknown'),
        receiver: typeof receiver === 'string' ? receiver : (receiver?.pubkey || receiver?.toString() || 'Unknown'),
        tokenInfo
      }
    } catch (error) {
      console.error('❌ Error fetching Solana transaction token changes:', error)
      return {
        tokenChanges: [],
        sender: 'Unknown',
        receiver: 'Unknown',
        tokenInfo: null
      }
    }
  }
}

export const solanaRPCService = new SolanaRPCService()

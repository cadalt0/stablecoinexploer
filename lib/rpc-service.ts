// RPC Service for Base Network
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base-mainnet.gateway.tatum.io/'
const TATUM_API_KEY = process.env.NEXT_PUBLIC_TATUM_API_KEY

// Token contract addresses on Base
export const TOKEN_CONTRACTS = {
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
}

console.log('RPC Service Config:', {
  BASE_RPC_URL,
  HAS_API_KEY: !!TATUM_API_KEY,
  API_KEY_PREFIX: TATUM_API_KEY ? TATUM_API_KEY.substring(0, 8) + '...' : 'none'
})

console.log('Token Contracts:', TOKEN_CONTRACTS)

// ERC-20 ABI for token balance checking
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
]

class BaseRPCService {
  private lastRequestTime = 0
  private readonly rateLimitMs = 1000 // 1 second between requests

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
    
    const requestBody = {
      jsonrpc: "2.0",
      method,
      params,
      id: 1
    }

    console.log('📡 Making RPC request:', { method, params })

    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TATUM_API_KEY || ''
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`RPC request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`)
    }

    console.log('📡 RPC response:', { method, result: data.result })
    return data.result
  }

  async getTransaction(txHash: string) {
    return this.makeRequest('eth_getTransactionByHash', [txHash])
  }

  async getTransactionReceipt(txHash: string) {
    return this.makeRequest('eth_getTransactionReceipt', [txHash])
  }

  async getBlock(blockNumber: string) {
    return this.makeRequest('eth_getBlockByNumber', [blockNumber, false])
  }

  async getBalance(address: string) {
    return this.makeRequest('eth_getBalance', [address, 'latest'])
  }

  async getTokenBalance(contractAddress: string, address: string) {
    // balanceOf(address) selector: 0x70a08231
    const data = '0x70a08231' + address.slice(2).padStart(64, '0')
    return this.makeRequest('eth_call', [{ to: contractAddress, data }, 'latest'])
  }

  async getTokenDecimals(contractAddress: string) {
    // decimals() selector: 0x313ce567
    const data = '0x313ce567'
    const result = await this.makeRequest('eth_call', [{ to: contractAddress, data }, 'latest'])
    return parseInt(result, 16)
  }

  async getTokenSymbol(contractAddress: string) {
    // symbol() selector: 0x95d89b41
    const data = '0x95d89b41'
    const result = await this.makeRequest('eth_call', [{ to: contractAddress, data }, 'latest'])
    // Decode the string from hex
    const symbol = this.decodeString(result)
    console.log('🪙 Token symbol retrieved:', { contractAddress, result, symbol })
    return symbol
  }

  async getTokenName(contractAddress: string) {
    // name() selector: 0x06fdde03
    const data = '0x06fdde03'
    const result = await this.makeRequest('eth_call', [{ to: contractAddress, data }, 'latest'])
    return this.decodeString(result)
  }

  private decodeString(hexString: string): string {
    if (!hexString || hexString === '0x') return ''
    
    // Remove 0x prefix and decode
    const hex = hexString.slice(2)
    let result = ''
    
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16)
      if (byte !== 0) {
        result += String.fromCharCode(byte)
      }
    }
    
    return result
  }

  // Check if transaction involves specific tokens
  async checkTransactionTokens(txHash: string) {
    try {
      console.log('🔍 Checking transaction tokens for:', txHash)
      
      const tx = await this.getTransaction(txHash)
      console.log('📄 Transaction data:', tx)
      
      const receipt = await this.getTransactionReceipt(txHash)
      console.log('📋 Transaction receipt:', receipt)
      
      if (!tx || !receipt) {
        console.log('❌ Missing transaction or receipt data')
        return null
      }

      let tokenInfo = null
      let transferAmount = "0"
      let actualSender = tx.from
      let actualReceiver = tx.to
      let isTokenTransaction = false
      
      const tokenContracts = Object.values(TOKEN_CONTRACTS).map(addr => addr.toLowerCase())
      const txToLower = tx.to?.toLowerCase()
      const isTokenTx = tokenContracts.includes(txToLower)
      
      // Check logs for Transfer events
      let isTokenTransferViaLogs = false
      let foundTransferLog = null
      
      if (receipt.logs && receipt.logs.length > 0) {
        console.log('🔍 Checking logs for token transfers...', {
          totalLogs: receipt.logs.length,
          transferEventSignature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        })
        
        for (const log of receipt.logs) {
          console.log('📋 Processing log:', {
            address: log.address,
            addressLower: log.address?.toLowerCase(),
            firstTopic: log.topics?.[0],
            isTransferEvent: log.topics?.[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          })
          
          if (log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            const logAddress = log.address?.toLowerCase()
            if (tokenContracts.includes(logAddress)) {
              isTokenTransferViaLogs = true
              foundTransferLog = log
              console.log('🪙 Found token transfer via logs:', { logAddress, log })
              break
            }
          }
        }
      }
      
      isTokenTransaction = isTokenTx || isTokenTransferViaLogs
      console.log('🪙 Token detection result:', {
        isTokenTx,
        isTokenTransferViaLogs,
        isTokenTransaction,
        foundTransferLog: !!foundTransferLog
      })
      
      if (isTokenTransaction) {
        let tokenContract = tx.to
        
        if (foundTransferLog) {
          tokenContract = foundTransferLog.address
          
          // Extract sender and receiver from log topics
          if (foundTransferLog.topics[1] && foundTransferLog.topics[2]) {
            const fromTopic = foundTransferLog.topics[1]
            const toTopic = foundTransferLog.topics[2]
            actualSender = '0x' + fromTopic.slice(-40) // Remove padding
            actualReceiver = '0x' + toTopic.slice(-40) // Remove padding
            
            console.log('🪙 Extracted addresses from log:', {
              fromTopic,
              toTopic,
              actualSender,
              actualReceiver
            })
          }
          
          // Extract amount from log data
          if (foundTransferLog.data && foundTransferLog.data.length >= 66) {
            const amountHex = foundTransferLog.data.slice(2) // Remove 0x
            const amount = parseInt(amountHex, 16)
            const decimals = await this.getTokenDecimals(foundTransferLog.address)
            transferAmount = (amount / Math.pow(10, decimals)).toFixed(6)
            
            console.log('🪙 Extracted amount from log:', {
              logData: foundTransferLog.data,
              amountHex,
              amount,
              decimals,
              transferAmount
            })
          }
        }
        
        const symbol = await this.getTokenSymbol(tokenContract)
        const name = await this.getTokenName(tokenContract)
        const decimals = await this.getTokenDecimals(tokenContract)
        
        tokenInfo = {
          contract: tokenContract,
          symbol,
          name,
          decimals,
          transferAmount
        }
        
        console.log('🪙 Final token info:', {
          tokenInfo,
          symbol,
          name,
          decimals,
          transferAmount,
          contractAddress: tokenContract
        })
      }

      return {
        transaction: tx,
        receipt,
        tokenInfo,
        isTokenTransaction,
        transferAmount,
        actualSender,
        actualReceiver
      }
    } catch (error) {
      console.error('❌ Error checking transaction tokens:', error)
      return null
    }
  }

  // Get token balances for an address (optimized with batching)
  async getAddressTokenBalances(address: string) {
    const balances = []
    
    console.log(`🪙 Fetching token balances for ${address} (rate limited to 1 req/sec)`)
    
    // Process tokens one by one to respect rate limiting
    for (const [symbol, contract] of Object.entries(TOKEN_CONTRACTS)) {
      try {
        console.log(`🪙 Checking ${symbol} balance...`)
        
        // Get balance and decimals in sequence (2 API calls per token)
        const balance = await this.getTokenBalance(contract, address)
        const decimals = await this.getTokenDecimals(contract)
        const tokenName = await this.getTokenName(contract)
        
        console.log(`🪙 ${symbol} balance processing:`, {
          contract,
          address,
          balance,
          decimals,
          tokenName
        })
        
        // Convert balance from wei to token units
        const balanceInTokens = (parseInt(balance, 16) / Math.pow(10, decimals)).toFixed(6)
        
        if (parseFloat(balanceInTokens) > 0) {
          balances.push({
            symbol,
            name: tokenName,
            contract,
            balance: balanceInTokens,
            decimals
          })
          console.log(`✅ ${symbol} balance: ${balanceInTokens}`)
        } else {
          console.log(`ℹ️ ${symbol} balance: 0 (skipping)`)
        }
      } catch (error) {
        console.error(`❌ Error getting ${symbol} balance:`, error)
      }
    }
    
    console.log(`🪙 Token balance fetch complete. Found ${balances.length} tokens with balance > 0`)
    return balances
  }
}

export const baseRPCService = new BaseRPCService()

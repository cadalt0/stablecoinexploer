# API Rate Limiting Documentation

## Rate Limiting Implementation

This project implements strict rate limiting to ensure **maximum 1 API call per second** to the Base network RPC endpoint.

## API Call Analysis

### Single Transaction Page Load

When loading a transaction page (`/tx/[hash]`), the following API calls are made:

#### 1. Transaction Data (3 calls)
- `eth_getTransactionByHash` - Get transaction details
- `eth_getTransactionReceipt` - Get transaction status and gas usage  
- `eth_getBlockByNumber` - Get block timestamp

#### 2. Token Information (if token transaction - 3 calls)
- `eth_call` - Get token symbol
- `eth_call` - Get token name
- `eth_call` - Get token decimals

#### 3. Token Balances (up to 18 calls for 2 addresses)
For each address (sender + receiver):
- `eth_call` - Get USDC balance
- `eth_call` - Get USDC decimals
- `eth_call` - Get USDC name
- `eth_call` - Get USDT balance
- `eth_call` - Get USDT decimals
- `eth_call` - Get USDT name
- `eth_call` - Get DAI balance
- `eth_call` - Get DAI decimals
- `eth_call` - Get DAI name

**Total: Up to 24 API calls per transaction page**

## Rate Limiting Strategy

### Implementation
```typescript
class BaseRPCService {
  private lastRequestTime = 0
  
  private async rateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < 1000) {
      const delay = 1000 - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    this.lastRequestTime = Date.now()
  }
}
```

### Behavior
- **Minimum 1 second** between each API call
- **Automatic delay** if requests are made too quickly
- **Console logging** shows rate limiting status
- **Sequential processing** for token balances

## Loading Time Estimation

### With Rate Limiting
- **Transaction data**: 3 seconds (3 calls × 1 sec)
- **Token info**: 3 seconds (3 calls × 1 sec) 
- **Sender balances**: 9 seconds (9 calls × 1 sec)
- **Receiver balances**: 9 seconds (9 calls × 1 sec)

**Total estimated time: ~24 seconds for full page load**

### Optimization Strategies

1. **Skip zero balances**: Only fetch token info if balance > 0
2. **Cache token metadata**: Store symbol/name/decimals to avoid repeated calls
3. **Parallel address processing**: Process sender/receiver in parallel (still rate limited)
4. **Progressive loading**: Show transaction data first, then load balances

## Console Logging

The app provides detailed logging for rate limiting:

```
⏳ Rate limiting: waiting 500ms before next request
🪙 Fetching token balances for 0x123... (rate limited to 1 req/sec)
🪙 Checking USDC balance...
✅ USDC balance: 1.234567
ℹ️ USDT balance: 0 (skipping)
```

## Error Handling

- **Rate limit violations**: Automatically handled with delays
- **API failures**: Individual token balance failures don't stop the process
- **Network errors**: Graceful degradation with error logging

## Configuration

Rate limiting is hardcoded to 1 second but can be adjusted:

```typescript
// In lib/rpc-service.ts
if (timeSinceLastRequest < 1000) { // Change this value
  const delay = 1000 - timeSinceLastRequest
  // ...
}
```

## Monitoring

To monitor API usage:
1. Open browser developer tools
2. Check console for rate limiting messages
3. Look for "⏳ Rate limiting" and "🪙 Fetching" messages
4. Monitor total loading time

## Best Practices

1. **Be patient**: Full page load takes ~24 seconds due to rate limiting
2. **Check console**: Monitor rate limiting and API call progress
3. **Optimize queries**: Only load necessary data
4. **Consider caching**: Implement client-side caching for repeated requests


// Blockchain detection utility
import { solanaRPCService } from './solana-rpc-service'

export type BlockchainType = 'evm' | 'solana' | 'unknown'

export function detectBlockchainType(input: string): BlockchainType {
  // Remove any whitespace
  const cleanInput = input.trim()
  
  // Check for EVM addresses (0x prefix, 42 characters)
  if (cleanInput.startsWith('0x') && cleanInput.length === 42) {
    return 'evm'
  }
  
  // Check for EVM transaction hashes (0x prefix, 66 characters)
  if (cleanInput.startsWith('0x') && cleanInput.length === 66) {
    return 'evm'
  }
  
  // Check for Solana addresses (base58, 32-44 characters)
  if (solanaRPCService.isValidSolanaAddress(cleanInput)) {
    return 'solana'
  }
  
  // Check for Solana transaction signatures (base58, 88 characters)
  if (solanaRPCService.isValidSolanaSignature(cleanInput)) {
    return 'solana'
  }
  
  return 'unknown'
}

export function getBlockchainDisplayName(type: BlockchainType): string {
  switch (type) {
    case 'evm':
      return 'EVM (Ethereum/Base)'
    case 'solana':
      return 'Solana'
    case 'unknown':
      return 'Unknown'
    default:
      return 'Unknown'
  }
}

export function getBlockchainIcon(type: BlockchainType): string {
  switch (type) {
    case 'evm':
      return '◉'
    case 'solana':
      return '◎'
    case 'unknown':
      return '?'
    default:
      return '?'
  }
}

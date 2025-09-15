"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TableSkeleton, SummarySkeleton } from "@/components/skeleton-loader"
import { searchTransactionOrAddress } from "@/lib/mock-data"
import { detectBlockchainType, getBlockchainDisplayName, getBlockchainIcon, type BlockchainType } from "@/lib/blockchain-detector"
import { solanaRPCService } from "@/lib/solana-rpc-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"


interface SearchInterfaceProps {
  onSearchStateChange?: (isSearching: boolean) => void
}

export function SearchInterface({ onSearchStateChange }: SearchInterfaceProps) {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [detectedType, setDetectedType] = useState<"address" | "transaction" | null>(null)
  const [detectedBlockchain, setDetectedBlockchain] = useState<BlockchainType | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchValue.trim()) return

    setIsSearching(true)
    onSearchStateChange?.(true)

    const query = searchValue.trim()
    const blockchainType = detectBlockchainType(query)
    
    console.log('🔍 Detected blockchain type:', blockchainType)
    
    if (blockchainType === 'evm') {
      // EVM addresses and transactions
      if (query.startsWith('0x') && query.length === 66) {
        console.log('🔍 EVM transaction hash, redirecting to /tx')
        setDetectedType('transaction')
        setDetectedBlockchain('evm')
        router.push(`/tx/${query}`)
      } else if (query.startsWith('0x') && query.length === 42) {
        console.log('🔍 EVM address, redirecting to /address')
        setDetectedType('address')
        setDetectedBlockchain('evm')
        router.push(`/address/${query}`)
      }
    } else if (blockchainType === 'solana') {
      // Solana addresses and transactions
      if (solanaRPCService.isValidSolanaSignature(query)) {
        console.log('🔍 Solana transaction signature, redirecting to /tx')
        setDetectedType('transaction')
        setDetectedBlockchain('solana')
        router.push(`/tx/${query}`)
      } else if (solanaRPCService.isValidSolanaAddress(query)) {
        console.log('🔍 Solana address, redirecting to /address')
        setDetectedType('address')
        setDetectedBlockchain('solana')
        router.push(`/address/${query}`)
      }
    } else {
      // Unknown format
      console.log('🔍 Unknown format, trying to validate with blockchain data...')
      try {
        const result = await searchTransactionOrAddress(query)
        if (result.type === "transaction") {
          router.push(`/tx/${query}`)
        } else if (result.type === "address") {
          router.push(`/address/${query}`)
        } else {
          toast({
            title: "Invalid format",
            description: "Please enter a valid EVM (0x...) or Solana address/transaction.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('❌ Search validation failed:', error)
        toast({
          title: "Search failed",
          description: "Unable to validate the search query. Please check the format.",
          variant: "destructive",
        })
      }
    }

    setIsSearching(false)
    onSearchStateChange?.(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    // Detect blockchain type and input type as user types
    const blockchainType = detectBlockchainType(value)
    setDetectedBlockchain(blockchainType)
    
    if (blockchainType === 'evm') {
      if (value.startsWith('0x') && value.length === 66) {
        setDetectedType('transaction')
      } else if (value.startsWith('0x') && value.length === 42) {
        setDetectedType('address')
      } else {
        setDetectedType(null)
      }
    } else if (blockchainType === 'solana') {
      if (solanaRPCService.isValidSolanaSignature(value)) {
        setDetectedType('transaction')
      } else if (solanaRPCService.isValidSolanaAddress(value)) {
        setDetectedType('address')
      } else {
        setDetectedType(null)
      }
    } else {
      setDetectedType(null)
    }
  }


  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter EVM address (0x...) or Solana address/transaction"
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                disabled={isSearching}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={!searchValue.trim() || isSearching}
              className="h-12 px-6 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {detectedType && detectedBlockchain && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Detected:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              detectedType === 'transaction' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            }`}>
              {detectedType === 'transaction' ? 'Transaction' : 'Address'}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              <span>{getBlockchainIcon(detectedBlockchain)}</span>
              <span>{getBlockchainDisplayName(detectedBlockchain)}</span>
            </span>
          </div>
        )}

      </div>
    </Card>
  )
}

export { TableSkeleton, SummarySkeleton }

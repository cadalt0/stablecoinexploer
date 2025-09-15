"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowLeft, CheckCircle, Clock, XCircle, DollarSign, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getTransactionById, coinIcons, statusConfig } from "@/lib/mock-data"
import Link from "next/link"
import { notFound } from "next/navigation"

const statusIcons = {
  success: CheckCircle,
  pending: Clock,
  failed: XCircle,
}

export default function TransactionPage() {
  const params = useParams()
  const { toast } = useToast()
  const txId = params.id as string

  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("Loading real blockchain data...")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        console.log('🚀 Starting transaction fetch for:', txId)
        console.log('🔧 Environment check:', {
          hasRpcUrl: !!process.env.NEXT_PUBLIC_BASE_RPC_URL,
          hasApiKey: !!process.env.NEXT_PUBLIC_TATUM_API_KEY,
          rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
          apiKeyPrefix: process.env.NEXT_PUBLIC_TATUM_API_KEY ? process.env.NEXT_PUBLIC_TATUM_API_KEY.substring(0, 8) + '...' : 'none'
        })
        
        console.log('📞 Calling getTransactionById...')
        const tx = await getTransactionById(txId)
        console.log('📄 getTransactionById result:', tx)
        
        if (!tx) {
          console.log('❌ No real blockchain transaction found for:', txId)
          notFound()
          return
        }
        console.log('✅ Transaction loaded successfully:', tx)
        setTransaction(tx)

      } catch (error) {
        console.error('❌ Error fetching transaction data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [txId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button skeleton with shimmer effect */}
            <div className="mb-6">
              <div className="h-10 w-32 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>

            {/* Main card skeleton with enhanced styling */}
            <div className="bg-card rounded-xl border shadow-lg backdrop-blur-sm">
              <div className="p-6">
                {/* Header skeleton with staggered animation */}
                <div className="mb-6">
                  <div className="h-8 w-48 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-lg animate-pulse mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                  </div>
                  <div className="h-4 w-64 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.2s_infinite]"></div>
                  </div>
                </div>

                {/* Transaction details skeleton with wave effect */}
                <div className="mb-6">
                  <div className="h-6 w-32 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-lg animate-pulse mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.8s_infinite]"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.1s_infinite]"></div>
                    </div>
                    <div className="h-4 w-3/4 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.3s_infinite]"></div>
                    </div>
                  </div>
                </div>

                {/* Sender & Receiver skeleton with enhanced animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 w-4 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.4s_infinite]"></div>
                      </div>
                      <div className="h-4 w-16 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.6s_infinite]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.0s_infinite]"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 w-4 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                      </div>
                      <div className="h-4 w-20 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.7s_infinite]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.1s_infinite]"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.3s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamp and Amount skeleton with enhanced effects */}
                <div className="border-t border-muted/30 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                      <div className="h-4 w-20 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse mb-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.4s_infinite]"></div>
                      </div>
                      <div className="h-4 w-32 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.6s_infinite]"></div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                      <div className="h-4 w-24 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse mb-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-24 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.2s_infinite]"></div>
                        </div>
                        <div className="h-6 w-6 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-full animate-pulse relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.8s_infinite]"></div>
                        </div>
                        <div className="h-4 w-12 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.4s_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gas Fee skeleton with final touch */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm mt-6">
                  <div className="h-4 w-16 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.6s_infinite]"></div>
                  </div>
                  <div className="h-6 w-24 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.3s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom shimmer animation keyframes */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  if (!transaction) {
    notFound()
  }

  const StatusIcon = statusIcons[transaction.status as keyof typeof statusIcons]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const formatAddress = (address: string | any) => {
    // Handle both string addresses and objects
    if (typeof address === 'string') {
      return address
    }
    if (address && typeof address === 'object') {
      // If it's an object, try to extract the address string
      return address.toString ? address.toString() : String(address)
    }
    return 'Unknown'
  }

  const getAddressString = (address: string | any) => {
    // Extract string value for href
    if (typeof address === 'string') {
      return address
    }
    if (address && typeof address === 'object') {
      return address.toString ? address.toString() : String(address)
    }
    return 'unknown'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 hover-lift bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Explorer
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Transaction Details</h1>
            <p className="text-muted-foreground">Essential transaction information</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="animate-scale-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <span>Transaction Details</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`${statusConfig[transaction.status as keyof typeof statusConfig].bg} ${statusConfig[transaction.status as keyof typeof statusConfig].color} border-0 animate-bounce-in`}
                >
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Badge>
              </CardTitle>
                <div className="mt-2 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-sm break-all flex-1">{formatAddress(transaction.hash!)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                      className="h-6 w-6 hover:bg-accent/20 flex-shrink-0"
                        onClick={() => copyToClipboard(transaction.hash!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sender & Receiver Section */}
              <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-full bg-secondary/10">
                        <Users className="h-4 w-4 text-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold">Sender</h3>
                    </div>
                    <div className="flex items-start gap-2 mb-3">
                    <Link
                      href={`/address/${getAddressString(transaction.sender)}`}
                        className="font-mono text-sm hover:text-primary transition-colors break-all flex-1"
                    >
                      {formatAddress(transaction.sender)}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                        className="h-6 w-6 hover:bg-accent/20 flex-shrink-0"
                      onClick={() => copyToClipboard(getAddressString(transaction.sender))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-full bg-secondary/10">
                        <Users className="h-4 w-4 text-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold">Receiver</h3>
                    </div>
                    <div className="flex items-start gap-2 mb-3">
                    <Link
                      href={`/address/${getAddressString(transaction.receiver)}`}
                        className="font-mono text-sm hover:text-primary transition-colors break-all flex-1"
                    >
                      {formatAddress(transaction.receiver)}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                        className="h-6 w-6 hover:bg-accent/20 flex-shrink-0"
                      onClick={() => copyToClipboard(getAddressString(transaction.receiver))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              </div>

              {/* Timestamp and Amount Section */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <p className="font-mono text-sm mt-1">{transaction.timestamp}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <label className="text-sm font-medium text-muted-foreground">Token Amount</label>
                    {transaction.tokenInfo ? (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-bold text-primary">{transaction.amount}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{coinIcons[transaction.coinType] || "◉"}</span>
                          <span className="font-medium text-sm">{transaction.tokenInfo.symbol}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">No token transfer detected</p>
                        <p className="text-xs text-muted-foreground mt-1">This transaction does not involve USDC, USDT, or DAI tokens</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gas Fee Section */}
              <div className="p-4 rounded-lg bg-muted/50">
                <label className="text-sm font-medium text-muted-foreground">Gas Fee</label>
                <p className="text-lg font-semibold mt-1">{transaction.gasFee}</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

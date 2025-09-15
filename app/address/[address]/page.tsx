"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowLeft, Wallet, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAddressInfo } from "@/lib/mock-data"
import Link from "next/link"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

function AddressPageContent() {
  const params = useParams()
  const { toast } = useToast()
  const address = params.address as string

  const [addressInfo, setAddressInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const addressData = await getAddressInfo(address)
        
        if (!addressData) {
          setError('Address not found')
          return
        }
        
        setAddressInfo(addressData)
      } catch (err) {
        console.error('Error loading address data:', err)
        setError('Failed to load address data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [address])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back button skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-32 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
            <div>
              <div className="h-8 w-48 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-lg animate-pulse mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.5s_infinite]"></div>
              </div>
              <div className="h-4 w-64 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.2s_infinite]"></div>
              </div>
            </div>
          </div>

          {/* Main card skeleton */}
          <div className="bg-card rounded-xl border shadow-lg backdrop-blur-sm">
            <div className="p-6">
              {/* Header skeleton */}
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

              {/* Stats grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-full animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.4s_infinite]"></div>
                    </div>
                    <div className="h-4 w-24 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.6s_infinite]"></div>
                    </div>
                  </div>
                  <div className="h-8 w-32 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.2s_infinite]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/60 border border-muted/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-gradient-to-r from-muted/50 via-muted/70 to-muted/50 rounded-full animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                    </div>
                    <div className="h-4 w-28 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.7s_infinite]"></div>
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg animate-pulse relative overflow-hidden">
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Link href="/">
              <Button variant="outline">Back to Explorer</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!addressInfo) {
    notFound()
  }

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

  const formatAddress = (addr: string) => {
    if (!addr || typeof addr !== 'string') return 'Invalid Address'
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 hover-lift bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Explorer
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Address Overview</h1>
            <p className="text-muted-foreground">Wallet information and transaction history</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="animate-scale-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-sm break-all">{formatAddress(addressInfo.address)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-accent/20 flex-shrink-0"
                    onClick={() => copyToClipboard(addressInfo.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="animate-bounce-in" style={{ animationDelay: "0.1s" }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Total Balance</span>
                    </div>
                    <p className="text-2xl font-bold mt-1 text-primary">{addressInfo.balance}</p>
                  </CardContent>
                </Card>


                <Card className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last Activity</span>
                    </div>
                    <p className="text-sm font-mono mt-1">{addressInfo.lastSeen?.split(" ")[0] || 'Unknown'}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Export with dynamic import to prevent hydration issues
export default dynamic(() => Promise.resolve(AddressPageContent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Explorer
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Address Overview</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading address data...</p>
        </div>
      </div>
    </div>
  )
})

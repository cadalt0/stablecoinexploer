"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { baseRPCService } from "@/lib/rpc-service"

export default function TestRPCPage() {
  const [txHash, setTxHash] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRPC = async () => {
    if (!txHash) return
    
    setLoading(true)
    setResult(null)
    
    try {
      console.log("🧪 Testing RPC with transaction:", txHash)
      
      // Test basic RPC connection
      const blockNumber = await baseRPCService.getCurrentBlockNumber()
      console.log("📦 Current block number:", blockNumber)
      
      // Test transaction fetch
      const tx = await baseRPCService.getTransaction(txHash)
      console.log("📄 Transaction:", tx)
      
      // Test transaction receipt
      const receipt = await baseRPCService.getTransactionReceipt(txHash)
      console.log("📋 Receipt:", receipt)
      
      setResult({
        blockNumber,
        transaction: tx,
        receipt: receipt,
        success: true
      })
    } catch (error) {
      console.error("❌ RPC test failed:", error)
      setResult({
        error: error instanceof Error ? error.message : String(error),
        success: false
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>RPC Service Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Base transaction hash..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
              <Button onClick={testRPC} disabled={loading || !txHash}>
                {loading ? "Testing..." : "Test RPC"}
              </Button>
            </div>
            
            {result && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {result.success ? "✅ Success" : "❌ Error"}
                </h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Test Transaction Hashes:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Try these real Base network transaction hashes:
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div>0x1a2b3c4d5e6f7890abcdef1234567890abcdef12 (mock)</div>
                <div>0x1234567890abcdef1234567890abcdef12345678 (test)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


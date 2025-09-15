"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { baseRPCService } from "@/lib/rpc-service"

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRPC = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log("🧪 Testing RPC connection...")
      
      // Test basic RPC connection
      const blockNumber = await baseRPCService.getCurrentBlockNumber()
      console.log("📦 Current block number:", blockNumber)
      
      // Test with a known USDC transaction hash
      const testTxHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      console.log("🔍 Testing with transaction hash:", testTxHash)
      
      const tx = await baseRPCService.getTransaction(testTxHash)
      console.log("📄 Transaction result:", tx)
      
      setResult({
        blockNumber,
        transaction: tx,
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
            <CardTitle>RPC Debug Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testRPC} disabled={loading}>
              {loading ? "Testing..." : "Test RPC Connection"}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


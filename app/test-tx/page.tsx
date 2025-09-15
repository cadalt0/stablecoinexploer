"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getTransactionById } from "@/lib/mock-data"

export default function TestTxPage() {
  const [txHash, setTxHash] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testTransaction = async () => {
    if (!txHash) return
    
    setLoading(true)
    setResult(null)
    
    try {
      console.log("🧪 Testing transaction fetch for:", txHash)
      
      const tx = await getTransactionById(txHash)
      console.log("📄 Transaction result:", tx)
      
      setResult({
        transaction: tx,
        success: true
      })
    } catch (error) {
      console.error("❌ Transaction test failed:", error)
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
            <CardTitle>Transaction Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Transaction Hash:</label>
              <Input
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter transaction hash (0x...)"
                className="mt-1"
              />
            </div>
            
            <Button onClick={testTransaction} disabled={loading || !txHash}>
              {loading ? "Testing..." : "Test Transaction"}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto max-h-96">
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


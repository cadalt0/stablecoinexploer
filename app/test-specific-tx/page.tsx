'use client'

import { useState } from 'react'
import { baseRPCService } from '@/lib/rpc-service'

export default function TestSpecificTx() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testTx = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing specific transaction...')
      const txHash = '0x4f7e6b184bd157b10d9fa8ea27b3313c4022131983ad8cef2f6f37db6cc5acc9'
      
      const result = await baseRPCService.checkTransactionTokens(txHash)
      console.log('🧪 Test result:', result)
      setResult(result)
    } catch (error) {
      console.error('❌ Test error:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Specific Transaction</h1>
      <p className="mb-4">Testing transaction: 0x4f7e6b184bd157b10d9fa8ea27b3313c4022131983ad8cef2f6f37db6cc5acc9</p>
      <p className="mb-4">Expected: 1.069296 USDC transfer</p>
      
      <button 
        onClick={testTx}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Transaction'}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}


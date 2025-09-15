"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Copy, ExternalLink, ArrowUpDown, CheckCircle, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { getAllTransactions, coinIcons, statusConfig } from "@/lib/mock-data"
import Link from "next/link"

const statusIcons = {
  success: CheckCircle,
  pending: Clock,
  failed: XCircle,
}

// Helper functions to handle object addresses
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

function MobileTransactionCard({ tx, copyToClipboard, formatAddress }: any) {
  const StatusIcon = statusIcons[tx.status as keyof typeof statusIcons]

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{coinIcons[tx.coinType]}</span>
          <span className="font-medium">{tx.coinType}</span>
        </div>
        <Badge
          variant="secondary"
          className={`${statusConfig[tx.status as keyof typeof statusConfig].bg} ${
            statusConfig[tx.status as keyof typeof statusConfig].color
          } border-0`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {tx.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Token Amount</span>
          <span className="font-mono font-medium">{tx.amount || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">From</span>
          <div className="flex items-center gap-1">
            <Link href={`/address/${getAddressString(tx.sender)}`} className="font-mono text-sm hover:text-primary transition-colors">
              {formatAddress(tx.sender)}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-accent"
              onClick={() => copyToClipboard(getAddressString(tx.sender))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">To</span>
          <div className="flex items-center gap-1">
            <Link href={`/address/${getAddressString(tx.receiver)}`} className="font-mono text-sm hover:text-primary transition-colors">
              {formatAddress(tx.receiver)}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-accent"
              onClick={() => copyToClipboard(getAddressString(tx.receiver))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Time</span>
          <span className="font-mono text-sm">{tx.timestamp.split(" ")[1]}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Gas Fee</span>
          <span className="font-mono text-sm">{tx.gasFee}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/tx/${tx.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()
  const isMobile = useMobile()

  const mockTransactions = getAllTransactions()

  const itemsPerPage = 10
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Address copied successfully",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Transactions</span>
          <Badge variant="secondary" className="font-mono">
            {mockTransactions.length} transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4">
            {mockTransactions.map((tx, index) => (
              <div key={tx.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <MobileTransactionCard tx={tx} copyToClipboard={copyToClipboard} formatAddress={formatAddress} />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("timestamp")}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Time
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("coinType")}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Coin
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("amount")}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Token Amount
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Gas Fee</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx, index) => {
                  const StatusIcon = statusIcons[tx.status as keyof typeof statusIcons]
                  return (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-muted/50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {tx.timestamp.split(" ")[1]}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/address/${getAddressString(tx.sender)}`}
                            className="font-mono text-sm hover:text-primary transition-colors"
                          >
                            {formatAddress(tx.sender)}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-accent"
                            onClick={() => copyToClipboard(getAddressString(tx.sender))}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/address/${getAddressString(tx.receiver)}`}
                            className="font-mono text-sm hover:text-primary transition-colors"
                          >
                            {formatAddress(tx.receiver)}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-accent"
                            onClick={() => copyToClipboard(getAddressString(tx.receiver))}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{coinIcons[tx.coinType]}</span>
                          <span className="font-medium">{tx.coinType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">{tx.amount || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusConfig[tx.status as keyof typeof statusConfig].bg} ${
                            statusConfig[tx.status as keyof typeof statusConfig].color
                          } border-0`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{tx.gasFee}</TableCell>
                      <TableCell>
                        <Link href={`/tx/${tx.id}`}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-accent">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, mockTransactions.length)} of {mockTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  page = currentPage - 2 + i
                  if (page > totalPages) page = totalPages - 4 + i
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

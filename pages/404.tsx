import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft, AlertTriangle } from "lucide-react"

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-destructive mb-2">
              404
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              Page Not Found
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/tx/0x742d35Cc6634C0532925a3b8D4C9db96">
                  <Button variant="outline" size="sm" className="text-xs font-mono">
                    Transaction
                  </Button>
                </Link>
                <Link href="/address/0x8ba1f109551bD432803012645Hac136c">
                  <Button variant="outline" size="sm" className="text-xs font-mono">
                    Address
                  </Button>
                </Link>
                <Link href="/address/5D3br1bKTe93WFxZ5SthwxYwstjLHWECaFe9MT1j9g2S">
                  <Button variant="outline" size="sm" className="text-xs font-mono">
                    Solana Address
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

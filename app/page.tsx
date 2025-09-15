"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchInterface } from "@/components/search-interface"

export default function Home() {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-primary">StableCoin Explorer</h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto px-4 leading-relaxed">
            Track and explore stablecoin transactions with a simple, user-friendly interface designed for everyone.
          </p>
        </div>

        <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <SearchInterface onSearchStateChange={setIsSearching} />
        </div>

      </main>
    </div>
  )
}

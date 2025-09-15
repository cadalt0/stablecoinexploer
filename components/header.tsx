"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Coins } from "lucide-react"
import Link from "next/link"

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">StableCoin Explorer</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>

    </header>
  )
}

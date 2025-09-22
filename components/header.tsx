"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Search, Menu } from "lucide-react"
import { useState } from "react"
import { UserMenu } from "./user-menu"

interface HeaderProps {
  onQuestionClick: () => void
  onSearch?: (query: string) => void
  onMenuClick?: () => void
  onLogoClick?: () => void
}

export function Header({ onQuestionClick, onSearch, onMenuClick, onLogoClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setShowMobileSearch(false)
    }
  }

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <button
            onClick={handleLogoClick}
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          >
            <Image
              src="/kkojil-logo.png"
              alt="꼬질꼬질 로고"
              width={80}
              height={40}
              className="h-8 w-auto rounded-lg hover:opacity-80 transition-opacity"
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-52 lg:w-64 rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </form>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button size="sm" className="gap-2" onClick={onQuestionClick}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">질문하기</span>
          </Button>
          <UserMenu />
        </div>
      </div>

      {showMobileSearch && (
        <div className="border-t bg-background p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  )
}

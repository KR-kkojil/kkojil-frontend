"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BannerAdProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  textColor?: string
  closeable?: boolean
  className?: string
}

export function BannerAd({
  title = "광고 제목",
  description = "광고 설명이 들어갑니다. 여기에 광고 내용을 작성해주세요.",
  buttonText = "자세히 보기",
  buttonLink = "#",
  backgroundColor = "bg-gradient-to-r from-blue-500 to-purple-600",
  textColor = "text-white",
  closeable = true,
  className = "",
}: BannerAdProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className={`relative ${backgroundColor} ${textColor} rounded-lg p-4 md:p-6 mb-4 md:mb-6 ${className}`}>
      {closeable && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pr-8 md:pr-0">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm md:text-base opacity-90">{description}</p>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => window.open(buttonLink, "_blank")}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

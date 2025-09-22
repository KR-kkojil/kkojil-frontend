"use client"

import { useState, useCallback } from "react"
import type { UseUIStateReturn } from "@/types"

export function useUIState(): UseUIStateReturn {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [selectedChain, setSelectedChain] = useState<number | null>(null)
  const [prefilledQuestion, setPrefilledQuestion] = useState<{ text: string; category: string } | null>(null)

  const resetState = useCallback(() => {
    setSidebarOpen(false)
    setShowQuestionForm(false)
    setSelectedChain(null)
    setPrefilledQuestion(null)
  }, [])

  return {
    sidebarOpen,
    showQuestionForm,
    selectedChain,
    prefilledQuestion,
    setSidebarOpen,
    setShowQuestionForm,
    setSelectedChain,
    setPrefilledQuestion,
    resetState,
  }
}

"use client"

import { useState, useCallback } from "react"
import type { UseUIStateReturn } from "@/types"

export function useUIState(): UseUIStateReturn {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [prefilledQuestionData, setPrefilledQuestionData] = useState<{ text: string; category: string } | null>(null)

  const resetState = useCallback(() => {
    setSidebarOpen(false)
    setShowQuestionForm(false)
    setPrefilledQuestionData(null)
  }, [])

  return {
    sidebarOpen,
    showQuestionForm,
    prefilledQuestion: prefilledQuestionData,
    setSidebarOpen,
    setShowQuestionForm,
    setPrefilledQuestion: setPrefilledQuestionData,
    resetState,
  }
}

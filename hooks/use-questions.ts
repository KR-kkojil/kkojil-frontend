"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  getQuestions,
  addQuestion as addQuestionToStorage,
  searchQuestions as searchQuestionsInStorage,
  getQuestionsByCategory,
  initializeDefaultData,
} from "@/lib/storage"
import type { Question, UseQuestionsReturn } from "@/types"

// 디바운싱을 위한 유틸리티 함수
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useQuestions(): UseQuestionsReturn {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 검색어 디바운싱
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      initializeDefaultData()
      const allQuestions = getQuestions()
      setQuestions(allQuestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions")
    } finally {
      setLoading(false)
    }
  }, [])

  // 필터링된 질문들을 메모이제이션
  const filteredQuestions = useMemo(() => {
    let filtered = questions

    if (selectedCategory) {
      filtered = getQuestionsByCategory(selectedCategory)
    }

    if (debouncedSearchQuery.trim()) {
      filtered = searchQuestionsInStorage(debouncedSearchQuery).filter((q) =>
        selectedCategory ? q.category === selectedCategory : true,
      )
    }

    return filtered
  }, [questions, selectedCategory, debouncedSearchQuery])

  const addQuestion = useCallback((questionData: Omit<Question, "id" | "createdAt" | "chainCount">) => {
    try {
      const newQuestion = addQuestionToStorage(questionData)
      setQuestions((prev) => [newQuestion, ...prev])
      return newQuestion
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question")
      throw err
    }
  }, [])

  const searchQuestions = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const filterByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category)
  }, [])

  const refreshQuestions = useCallback(() => {
    loadQuestions()
  }, [loadQuestions])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return {
    questions,
    filteredQuestions,
    loading,
    error,
    addQuestion,
    searchQuestions,
    filterByCategory,
    refreshQuestions,
  }
}

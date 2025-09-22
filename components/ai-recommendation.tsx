"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RefreshCw, Plus } from "lucide-react"
import { CATEGORIES, getCategoryColor } from "@/lib/constants"

interface AIRecommendationProps {
  onQuestionSelect: (question: string, category: string) => void
}

export function AIRecommendation({ onQuestionSelect }: AIRecommendationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateQuestion = async (category: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentQuestion(data.question)
      } else {
        console.error("Failed to generate question")
        setCurrentQuestion("AI 질문 생성에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("Error generating question:", error)
      setCurrentQuestion("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentQuestion(null)
    generateQuestion(category)
  }

  const handleRefresh = () => {
    if (selectedCategory) {
      generateQuestion(selectedCategory)
    }
  }

  const handleUseQuestion = () => {
    if (currentQuestion && selectedCategory) {
      onQuestionSelect(currentQuestion, selectedCategory)
      setSelectedCategory(null)
      setCurrentQuestion(null)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI 추천 질문</h3>
      </div>

      {!selectedCategory ? (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            관심 있는 카테고리를 선택하면 AI가 흥미로운 질문을 추천해드려요
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={`${getCategoryColor(category)} border-0`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(selectedCategory)}>{selectedCategory}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              다른 카테고리
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">AI가 질문을 생성하고 있어요...</span>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-3">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-medium">{currentQuestion}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1 bg-transparent">
                  <RefreshCw className="h-3 w-3" />
                  다시 생성
                </Button>
                <Button size="sm" onClick={handleUseQuestion} className="gap-1">
                  <Plus className="h-3 w-3" />이 질문 사용
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  )
}

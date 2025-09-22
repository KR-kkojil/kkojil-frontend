"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Users, MessageCircle, HelpCircle, X } from "lucide-react"
import { AIRecommendation } from "./ai-recommendation"
import { useEffect, useState } from "react"
import { getRecentContent, getCategoryStats, getTrendingQuestions, type Question } from "@/lib/storage"

interface SidebarProps {
  onAIQuestionSelect?: (question: string, category: string) => void
  selectedCategory?: string | null
  onCategorySelect?: (category: string | null) => void
  onQuestionSelect?: (questionId: number) => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({
  onAIQuestionSelect,
  selectedCategory,
  onCategorySelect,
  onQuestionSelect,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [recentContent, setRecentContent] = useState<
    Array<{ type: "question" | "answer"; content: string; time: string; author: string }>
  >([])
  const [categoryStats, setCategoryStats] = useState<Array<{ name: string; count: number; color: string }>>([])
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([])

  useEffect(() => {
    const recentData = getRecentContent() || []
    const categoryData = getCategoryStats() || []
    const trendingData = getTrendingQuestions() || []

    setRecentContent(recentData)
    setCategoryStats(categoryData)
    setTrendingQuestions(trendingData)
  }, [])

  const handleContactDeveloper = () => {
    window.open("https://forms.gle/UipqbKAB1HTJnWph7", "_blank")
  }

  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      const newCategory = selectedCategory === categoryName ? null : categoryName
      onCategorySelect(newCategory)
    }
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  const handleTrendingQuestionClick = (questionId: number) => {
    if (onQuestionSelect) {
      onQuestionSelect(questionId)
    }
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside
        className={`
        fixed md:static top-0 left-0 h-full z-50
        w-80 sm:w-96 md:w-80 lg:w-96
        border-r bg-background md:bg-card/50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:transform-none
        overflow-y-auto
      `}
      >
        <div className="p-4 md:p-6">
          <div className="flex justify-end mb-4 md:hidden">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 md:space-y-6">
            <AIRecommendation onQuestionSelect={onAIQuestionSelect || (() => {})} />

            {/* 카테고리 */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                <Users className="h-4 w-4" />
                카테고리
              </h3>
              <div className="space-y-1 md:space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-between h-auto p-2 md:p-3 text-sm"
                  onClick={() => onCategorySelect?.(null)}
                >
                  <span>전체</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                    {Array.isArray(categoryStats) ? categoryStats.reduce((sum, cat) => sum + cat.count, 0) : 0}
                  </Badge>
                </Button>
                {Array.isArray(categoryStats) &&
                  categoryStats.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      className="w-full justify-between h-auto p-2 md:p-3 text-sm"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className={`${category.color} text-xs`}>
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
              </div>
            </div>

            {/* 인기 질문 */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                <TrendingUp className="h-4 w-4" />
                인기 질문
              </h3>
              <div className="space-y-1 md:space-y-2">
                {Array.isArray(trendingQuestions) &&
                  trendingQuestions.map((question) => (
                    <Button
                      key={question.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 md:p-3 text-left hover:bg-muted/80"
                      onClick={() => handleTrendingQuestionClick(question.id)}
                    >
                      <div className="flex flex-col items-start gap-1 w-full min-w-0">
                        <div className="w-full truncate text-xs md:text-sm font-medium" title={question.title}>
                          {question.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs px-1 py-0 flex-shrink-0">
                            {question.category}
                          </Badge>
                          <span className="flex-shrink-0">{question.chainCount}개 답변</span>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>

            <div className="hidden md:block">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                최근 내용
              </h3>
              <div className="space-y-2">
                {Array.isArray(recentContent) &&
                  recentContent.map((item, index) => (
                    <div key={index} className="p-2 rounded-md bg-muted/50 text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        {item.type === "question" ? (
                          <HelpCircle className="h-3 w-3 text-blue-500" />
                        ) : (
                          <MessageCircle className="h-3 w-3 text-green-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.type === "question" ? "질문" : "답변"} • {item.author} • {item.time}
                        </span>
                      </div>
                      <div className="truncate">{item.content}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent text-sm"
                onClick={handleContactDeveloper}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">개발자에게 문의하기</span>
                <span className="sm:hidden">문의하기</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

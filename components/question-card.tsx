"use client"

import { memo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight, Clock, User } from "lucide-react"
import { getCategoryColor } from "@/lib/constants"
import type { Question } from "@/types"

interface QuestionCardProps {
  question: Question
  onViewChain: (id: number) => void
  onContinueChain: (id: number) => void
}

export const QuestionCard = memo(function QuestionCard({ question, onViewChain, onContinueChain }: QuestionCardProps) {
  const handleViewChain = useCallback(() => {
    onViewChain(question.id)
  }, [onViewChain, question.id])

  const handleContinueChain = useCallback(() => {
    onContinueChain(question.id)
  }, [onContinueChain, question.id])

  const categoryColor = getCategoryColor(question.category)

  return (
    <Card className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${categoryColor} text-xs`}>{question.category}</Badge>
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-20 sm:max-w-none">{question.author}</span>
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {question.time}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground self-start sm:self-auto">
          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">{question.chainCount}개 연결</span>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-3 text-balance leading-tight">{question.title}</h3>

      {question.lastQuestion && (
        <div className="bg-muted/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium">최근 질문</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{question.lastQuestion}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div></div>
        <Button size="sm" className="gap-2 w-full sm:w-auto text-xs sm:text-sm" onClick={handleViewChain}>
          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">질문 체인 보기</span>
          <span className="xs:hidden">체인 보기</span>
        </Button>
      </div>
    </Card>
  )
})

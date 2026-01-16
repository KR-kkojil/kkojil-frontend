"use client"

import { memo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, ArrowRight, Clock, User, Share2 } from "lucide-react"
import { getCategoryColor } from "@/lib/constants"
import type { Question } from "@/types"

interface QuestionCardProps {
  question: Question
  onContinueChain: (id: number) => void
}

export const QuestionCard = memo(function QuestionCard({ question, onContinueChain }: QuestionCardProps) {
  const { toast } = useToast()
  const router = useRouter()

  const handleNavigate = useCallback(() => {
    router.push(`/questions/${question.id}`)
  }, [router, question.id])

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation() // 카드 전체 클릭 방지
      const questionUrl = `${window.location.origin}/questions/${question.id}`
      navigator.clipboard.writeText(questionUrl).then(
        () => {
          toast({
            title: "클립보드에 복사됨",
            description: "질문 링크가 클립보드에 복사되었습니다.",
          })
        },
        (err) => {
          console.error("클립보드 복사 실패: ", err)
          toast({
            title: "복사 실패",
            description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
            variant: "destructive",
          })
        },
      )
    },
    [question.id, toast],
  )

  const categoryColor = getCategoryColor(question.category)

  return (
    <Card
      className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleNavigate}
    >
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

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm" onClick={handleShare}>
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">공유하기</span>
        </Button>
        <Button size="sm" className="gap-2 w-full sm:w-auto text-xs sm:text-sm" onClick={handleNavigate}>
          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">질문 체인 보기</span>
          <span className="xs:hidden">체인 보기</span>
        </Button>
      </div>
    </Card>
  )
})

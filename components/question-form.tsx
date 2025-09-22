"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Send, Sparkles, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { CATEGORIES, getCategoryColor } from "@/lib/constants"

interface QuestionFormProps {
  onClose: () => void
  onSubmit: (question: string, category: string) => void
  prefilledData?: { text: string; category: string } | null
}

export function QuestionForm({ onClose, onSubmit, prefilledData }: QuestionFormProps) {
  const [question, setQuestion] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (prefilledData) {
      setQuestion(prefilledData.text)
      setSelectedCategory(prefilledData.category)
    }
  }, [prefilledData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && selectedCategory && user) {
      onSubmit(question.trim(), selectedCategory)
      setQuestion("")
      setSelectedCategory("")
      onClose()
    }
  }

  // 로그인하지 않은 사용자를 위한 UI
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
        <Card className="w-full max-w-md p-4 sm:p-6 mx-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">로그인이 필요합니다</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription className="text-sm">질문을 작성하려면 먼저 로그인해주세요.</AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button asChild className="flex-1">
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/auth/register">회원가입</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <Card className="w-full max-w-2xl p-4 sm:p-6 mx-2 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">새 질문 작성</h2>
            {prefilledData && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                <span className="hidden sm:inline">AI 추천</span>
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">카테고리 선택</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  className={`cursor-pointer transition-colors text-xs sm:text-sm px-2 py-1 ${
                    selectedCategory === category ? getCategoryColor(category) : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">질문 내용</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="궁금한 것을 질문해보세요. 다른 사람들이 꼬리에 꼬리를 물고 질문을 이어갈 거예요!"
              className="min-h-24 sm:min-h-32 resize-none text-sm sm:text-base"
              maxLength={500}
            />
            <div className="text-right text-xs sm:text-sm text-muted-foreground mt-1">{question.length}/500</div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-3 sm:gap-0">
            <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              {user.displayName}님으로 질문이 등록됩니다
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none bg-transparent">
                취소
              </Button>
              <Button
                type="submit"
                disabled={!question.trim() || !selectedCategory}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">질문하기</span>
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

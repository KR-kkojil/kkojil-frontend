"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowDown, User, Clock, Send, X, MessageSquare, HelpCircle, LogIn } from "lucide-react"
import { getChains, saveChain, formatTimeAgo, type ChainItem } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface QuestionChainProps {
  rootQuestion: {
    id: number
    title: string
    category: string
    author: string
    time: string
  }
  onClose: () => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정치: "bg-red-100 text-red-800",
    개발: "bg-blue-100 text-blue-800",
    철학: "bg-purple-100 text-purple-800",
    일상: "bg-green-100 text-green-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export function QuestionChain({ rootQuestion, onClose }: QuestionChainProps) {
  const [chain, setChain] = useState<ChainItem[]>([])
  const [newText, setNewText] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [nextType, setNextType] = useState<"question" | "answer">("answer")
  const { user } = useAuth()

  useEffect(() => {
    const loadedChains = getChains(rootQuestion.id)
    setChain(loadedChains)
  }, [rootQuestion.id])

  useEffect(() => {
    if (chain.length === 0) {
      setNextType("answer") // 첫 번째는 답변
    } else {
      const lastItem = chain[chain.length - 1]
      setNextType(lastItem.type === "question" ? "answer" : "question")
    }
  }, [chain])

  const handleAddItem = () => {
    if (newText.trim() && user) {
      const newChainItem = saveChain({
        parentId: rootQuestion.id,
        text: newText.trim(),
        author: user.displayName, // 로그인한 사용자의 displayName 사용
        time: formatTimeAgo(Date.now()),
        level: chain.length,
        type: nextType,
      })

      setChain([...chain, newChainItem])
      setNewText("")
      setShowAddForm(false)
    }
  }

  const fullChain = [
    {
      id: rootQuestion.id,
      text: rootQuestion.title,
      author: rootQuestion.author,
      time: rootQuestion.time,
      level: 0,
      parentId: 0,
      createdAt: 0,
      type: "question" as const,
    },
    ...chain.map((item, index) => ({ ...item, level: index + 1 })),
  ]

  const getItemStyle = (type: "question" | "answer", level: number) => {
    if (type === "question") {
      return level === 0 ? "bg-primary/5 border-primary/20" : "bg-blue-50 border-blue-200"
    } else {
      return "bg-green-50 border-green-200"
    }
  }

  const getItemIcon = (type: "question" | "answer") => {
    return type === "question" ? (
      <HelpCircle className="h-4 w-4 text-blue-600" />
    ) : (
      <MessageSquare className="h-4 w-4 text-green-600" />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Badge className={getCategoryColor(rootQuestion.category)}>{rootQuestion.category}</Badge>
            <h2 className="text-xl font-semibold">질문 체인</h2>
            <Badge variant="secondary">{fullChain.length}개 연결</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {fullChain.map((item, index) => (
              <div key={item.id} className="relative">
                <div className={`ml-${item.level * 4} max-w-3xl`}>
                  <Card className={`p-4 ${getItemStyle(item.type, item.level)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getItemIcon(item.type)}
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.author}</span>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                      {item.level === 0 && <Badge variant="secondary">원본 질문</Badge>}
                      {item.level > 0 && (
                        <Badge variant={item.type === "question" ? "default" : "secondary"}>
                          {item.type === "question" ? "질문" : "답변"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </Card>
                </div>

                {index < fullChain.length - 1 && (
                  <div className={`ml-${item.level * 4 + 6} my-2`}>
                    <ArrowDown className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {!user ? (
            <div className={`ml-${fullChain.length * 4} max-w-3xl mt-4`}>
              <div className="my-2">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>
              <Card className="p-4 border-dashed border-muted-foreground/50">
                <Alert>
                  <LogIn className="h-4 w-4" />
                  <AlertDescription>
                    {nextType === "question" ? "질문을 이어가려면" : "답변을 작성하려면"} 로그인이 필요합니다.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" asChild>
                    <Link href="/auth/login">로그인</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/register">회원가입</Link>
                  </Button>
                </div>
              </Card>
            </div>
          ) : showAddForm ? (
            <div className={`ml-${fullChain.length * 4} max-w-3xl mt-4`}>
              <Card className="p-4 border-dashed border-primary">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    {nextType === "question" ? (
                      <>
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">새 질문 추가</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">답변 추가</span>
                      </>
                    )}
                    <span className="text-sm text-muted-foreground">({user.displayName})</span>
                  </div>
                  <Textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder={
                      nextType === "question"
                        ? "답변에서 새롭게 떠오른 질문을 작성해보세요..."
                        : "위 질문에 대한 답변을 작성해보세요..."
                    }
                    className="min-h-20 resize-none"
                    maxLength={300}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{newText.length}/300</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                        취소
                      </Button>
                      <Button size="sm" onClick={handleAddItem} disabled={!newText.trim()} className="gap-2">
                        <Send className="h-3 w-3" />
                        {nextType === "question" ? "질문" : "답변"} 추가
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className={`ml-${fullChain.length * 4} max-w-3xl mt-4`}>
              <div className="my-2">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                className={`w-full h-16 border-dashed border-2 transition-all ${
                  nextType === "question"
                    ? "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-700"
                    : "border-green-300 hover:border-green-500 hover:bg-green-50 text-green-700"
                } bg-transparent`}
                onClick={() => setShowAddForm(true)}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    {nextType === "question" ? (
                      <>
                        <HelpCircle className="h-5 w-5" />
                        <span className="font-medium">질문 이어가기</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">답변하기</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {nextType === "question" ? "답변에서 새로운 질문을 만들어보세요" : "위 질문에 답변해보세요"}
                  </span>
                </div>
              </Button>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 질문 → 답변 → 새로운 질문 → 답변으로 자연스러운 대화를 이어가세요
          </p>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MessageSquare, HelpCircle, Settings, Edit, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getQuestions, getChains, formatTimeAgo, type Question, type ChainItem } from "@/lib/storage"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [userQuestions, setUserQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<ChainItem[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      // 사용자의 질문들 가져오기
      const allQuestions = getQuestions()
      const myQuestions = allQuestions.filter((q) => q.author === user.displayName)
      setUserQuestions(myQuestions)

      // 사용자의 답변들 가져오기
      const allAnswers: ChainItem[] = []
      allQuestions.forEach((question) => {
        const chains = getChains(question.id)
        const myAnswers = chains.filter((chain) => chain.author === user.displayName)
        allAnswers.push(...myAnswers)
      })
      setUserAnswers(allAnswers)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              메인으로
            </Link>
          </Button>

          {/* 프로필 헤더 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <h1 className="text-2xl font-bold">{user.displayName}</h1>
                      <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                    {user.bio && <p className="text-sm text-muted-foreground max-w-md">{user.bio}</p>}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatTimeAgo(user.joinedAt)} 가입
                      </div>
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        {userQuestions.length}개 질문
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {userAnswers.length}개 답변
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      설정
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      프로필 수정
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 활동 탭 */}
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">내 질문 ({userQuestions.length})</TabsTrigger>
              <TabsTrigger value="answers">내 답변 ({userAnswers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-4">
              {userQuestions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">아직 질문이 없습니다</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      궁금한 것이 있다면 첫 번째 질문을 올려보세요!
                    </p>
                    <Button asChild>
                      <Link href="/">질문하러 가기</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{question.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{question.category}</Badge>
                            <span className="text-sm text-muted-foreground">{question.time}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{question.chainCount}개 연결</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="answers" className="space-y-4">
              {userAnswers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">아직 답변이 없습니다</h3>
                    <p className="text-muted-foreground text-center mb-4">다른 사람의 질문에 답변해보세요!</p>
                    <Button asChild>
                      <Link href="/">답변하러 가기</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userAnswers.map((answer) => (
                  <Card key={answer.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={answer.type === "question" ? "default" : "secondary"}>
                            {answer.type === "question" ? "질문" : "답변"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{answer.time}</span>
                        </div>
                        <p className="text-sm">{answer.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

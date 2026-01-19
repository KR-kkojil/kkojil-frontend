"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, User, Clock, Share2 } from "lucide-react"
import { getQuestionById, getChains, type Question, type ChainItem } from "@/lib/storage"
import { getCategoryColor } from "@/lib/constants"
import { useToast } from "@/components/ui/use-toast"
import { useQuestions } from "@/hooks/use-questions"
import { useUIState } from "@/hooks/use-ui-state"

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = Number(params.id)
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [chains, setChains] = useState<ChainItem[]>([])
  const [loading, setLoading] = useState(true)

  // Sidebar 및 공통 상태
  const { questions: allQuestions } = useQuestions()
  const { sidebarOpen, setSidebarOpen } = useUIState()

  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false)
      return
    }

    // 로컬 스토리지에서 데이터 가져오기
    const q = getQuestionById(id)
    if (q) {
      setQuestion(q)
      setChains(getChains(id))
    }
    setLoading(false)
  }, [id])

  const handleShare = useCallback(() => {
      const questionUrl = window.location.href
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
  }, [toast])

  const handleLogoClick = useCallback(() => {
    router.push('/')
  }, [router])

  const handleMenuClick = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen, setSidebarOpen])

  if (loading) return <LoadingSpinner />
  
  if (!question) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                onMenuClick={handleMenuClick}
                onLogoClick={handleLogoClick}
                onSearch={() => {}} 
            />
             <div className="flex-1 flex justify-center items-center flex-col gap-4">
                <h2 className="text-xl font-bold">질문을 찾을 수 없습니다.</h2>
                <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
             </div>
        </div>
    )
  }

  const categoryColor = getCategoryColor(question.category)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onMenuClick={handleMenuClick}
        onLogoClick={handleLogoClick}
        onSearch={(q) => {}}
      />
      
      <div className="flex relative flex-1">
        <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            questions={allQuestions}
            onQuestionSelect={(qid) => router.push(`/questions/${qid}`)}
            onCategorySelect={() => router.push('/')}
        />
        
        <main className="flex-1 w-full md:w-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-4 pl-0 gap-2" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    돌아가기
                </Button>

                <Card className="p-6 mb-8 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge className={`${categoryColor} text-xs`}>{question.category}</Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {question.author}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {question.time}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{question.title}</h1>
                    </div>
                </Card>

                <div className="mb-6 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">
                        이어지는 질문과 답변 <span className="text-muted-foreground">({chains.length})</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {chains.length > 0 ? (
                        chains.map((chain) => (
                            <Card key={chain.id} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-sm">{chain.author}</div>
                                        <div className="text-xs text-muted-foreground">{chain.time}</div>
                                    </div>
                                    <Badge variant={chain.type === 'question' ? 'outline' : 'secondary'} className="text-xs">
                                        {chain.type === 'question' ? '질문' : '답변'}
                                    </Badge>
                                </div>
                                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{chain.text}</p>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">아직 등록된 답변이 없습니다.</p>
                            <p className="text-sm text-muted-foreground mt-1">첫 번째 답변을 남겨보세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
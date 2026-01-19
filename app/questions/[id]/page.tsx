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
import { ArrowLeft, User, Clock, Share2, HelpCircle, MessageSquare } from "lucide-react"
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

  const { questions: allQuestions } = useQuestions()
  const { sidebarOpen, setSidebarOpen } = useUIState()

  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false)
      return
    }

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
        onSearch={() => {}}
      />
      
      <div className="flex relative flex-1">
        <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            questions={allQuestions}
            onQuestionSelect={(qid) => router.push(`/questions/${qid}`)}
            onCategorySelect={() => router.push('/')}
        />
        
        <main className="flex-1 w-full md:w-auto p-4 md:p-6 bg-slate-50/50">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-4 pl-0 gap-2" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    돌아가기
                </Button>

                {/* 메인 질문 카드 (Timeline Start) */}
                <div className="relative">
                    {/* 수직 연결선 */}
                    <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border -z-10" />

                    <div className="mb-8 relative">
                        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground z-10 shadow-sm ring-4 ring-background">
                            <HelpCircle className="h-4 w-4" />
                        </div>
                        
                        <div className="ml-8">
                            <Card className="p-6 shadow-md border-primary/20">
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
                        </div>
                    </div>

                    {/* 이어지는 체인 리스트 */}
                    <div className="space-y-6">
                        {chains.map((chain, index) => (
                            <div key={chain.id} className="relative">
                                {/* 노드 아이콘 */}
                                <div className={`absolute -left-3 top-6 w-6 h-6 rounded-full flex items-center justify-center text-white z-10 shadow-sm ring-4 ring-background ${chain.type === 'question' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                                    {chain.type === 'question' ? (
                                        <HelpCircle className="h-3 w-3" />
                                    ) : (
                                        <MessageSquare className="h-3 w-3" />
                                    )}
                                </div>

                                <div className="ml-8">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs text-muted-foreground ml-1 mb-1 flex items-center gap-2">
                                            <span className="font-medium text-foreground">{chain.author}</span>
                                            <span>•</span>
                                            <span>{chain.time}</span>
                                        </div>
                                        
                                        <Card className={`p-4 transition-colors relative ${chain.type === 'question' ? 'bg-blue-50/50 border-blue-200' : 'bg-white hover:bg-slate-50'}`}>
                                            {/* 말풍선 꼬리 */}
                                            <div className={`absolute top-6 -left-2 w-4 h-4 transform rotate-45 border-l border-b ${chain.type === 'question' ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-border'} z-0`} />
                                            
                                            <div className="relative z-10">
                                                 {chain.type === 'question' && (
                                                    <div className="text-xs font-semibold text-blue-600 mb-1">
                                                        이어지는 질문
                                                    </div>
                                                )}
                                                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                                    {chain.text}
                                                </p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 체인 종료 / 입력 유도 */}
                    <div className="relative mt-8 pb-12">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-border z-10 ring-4 ring-background" />
                         <div className="ml-8">
                             <Button variant="outline" className="w-full h-auto py-4 border-dashed text-muted-foreground hover:text-foreground hover:border-primary/50" onClick={() => {}}>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-medium">이 질문에 꼬리를 물어보세요</span>
                                    <span className="text-xs">새로운 질문이나 답변을 남길 수 있습니다</span>
                                </div>
                             </Button>
                         </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

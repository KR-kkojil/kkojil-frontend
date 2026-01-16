"use client"

import { useRef, useCallback, useState } from "react"
import Head from "next/head"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { QuestionCard } from "@/components/question-card"
import { QuestionForm } from "@/components/question-form"
import { BannerAd } from "@/components/banner-ad"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useQuestions } from "@/hooks/use-questions"
import { useUIState } from "@/hooks/use-ui-state"
import type { Question } from "@/types"

export default function HomePage() {
  const { questions, filteredQuestions, loading, error, addQuestion, searchQuestions, filterByCategory } =
    useQuestions()

  const {
    sidebarOpen,
    showQuestionForm,
    prefilledQuestion,
    setSidebarOpen,
    setShowQuestionForm,
    setPrefilledQuestion,
    resetState,
  } = useUIState()

  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 3

  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const handleNewQuestion = useCallback(
    (questionText: string, category: string) => {
      try {
        addQuestion({
          title: questionText,
          category,
          author: "익명사용자",
          time: "방금 전",
        })
        setShowQuestionForm(false)
        setPrefilledQuestion(null)
      } catch (error) {
        console.error("Failed to add question:", error)
      }
    },
    [addQuestion, setShowQuestionForm, setPrefilledQuestion],
  )

  const handleAIQuestionSelect = useCallback(
    (question: string, category: string) => {
      setPrefilledQuestion({ text: question, category })
      setShowQuestionForm(true)
    },
    [setPrefilledQuestion, setShowQuestionForm],
  )

  const handleCloseQuestionForm = useCallback(() => {
    setShowQuestionForm(false)
    setPrefilledQuestion(null)
  }, [setShowQuestionForm, setPrefilledQuestion])

  const handleQuestionSelect = useCallback(
    (questionId: number) => {
      filterByCategory(null)
      searchQuestions("")

      setTimeout(() => {
        const questionElement = questionRefs.current[questionId]
        if (questionElement) {
          questionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          questionElement.classList.add("ring-2", "ring-blue-500", "ring-opacity-50")
          setTimeout(() => {
            questionElement.classList.remove("ring-2", "ring-blue-500", "ring-opacity-50")
          }, 2000)
        }
      }, 100)
    },
    [filterByCategory, searchQuestions],
  )

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen, setSidebarOpen])

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  const handleLogoClick = useCallback(() => {
    searchQuestions("")
    filterByCategory(null)
    resetState()
  }, [searchQuestions, filterByCategory, resetState])

  const getPageTitle = useCallback(() => {
    const hasSearch = filteredQuestions !== questions
    const searchQuery = hasSearch ? "검색" : ""

    if (searchQuery) return `"${searchQuery}" 검색 결과`
    return "최신 질문들"
  }, [filteredQuestions, questions])

  const getPageDescription = useCallback(() => {
    const count = filteredQuestions.length

    if (filteredQuestions !== questions) {
      return `${count}개의 질문을 찾았습니다`
    }
    return "꼬리에 꼬리를 무는 흥미로운 질문들을 탐험해보세요"
  }, [filteredQuestions, questions])

  const generateStructuredData = useCallback(() => {
    const questionsData = filteredQuestions.slice(0, 10).map((question, index) => ({
      "@type": "Question",
      name: question.title,
      text: question.title,
      dateCreated: new Date().toISOString(),
      author: {
        "@type": "Person",
        name: question.author,
      },
      answerCount: Math.floor(Math.random() * 10) + 1,
      upvoteCount: Math.floor(Math.random() * 50) + 1,
      url: `https://kkojil.com/question/${question.id}`,
    }))

    return {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "WebPage",
        name: "꼬질꼬질 - 질문 커뮤니티",
        description: "궁금한 것들을 자유롭게 질문하고 답변하는 커뮤니티",
        url: "https://kkojil.com",
        mainContentOfPage: questionsData,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "홈",
              item: "https://kkojil.com",
            },
          ],
        },
      },
    }
  }, [filteredQuestions])

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <Head>
        <title>{getPageTitle()} | 꼬질꼬질</title>
        <meta name="description" content={getPageDescription()} />
        <meta property="og:title" content={`${getPageTitle()} | 꼬질꼬질`} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:url" content="https://kkojil.com" />
        <meta name="twitter:title" content={`${getPageTitle()} | 꼬질꼬질`} />
        <meta name="twitter:description" content={getPageDescription()} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
      </Head>

      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onQuestionClick={() => setShowQuestionForm(true)}
          onSearch={searchQuestions}
          onMenuClick={handleMenuToggle}
          onLogoClick={handleLogoClick}
        />

        <div className="flex relative flex-1">
          <Sidebar
            onAIQuestionSelect={handleAIQuestionSelect}
            onCategorySelect={filterByCategory}
            onQuestionSelect={handleQuestionSelect}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            questions={filteredQuestions}
          />

          <main className="flex-1 w-full md:w-auto p-3 sm:p-4 md:p-6" role="main">
            <div className="max-w-4xl mx-auto">
              <BannerAd
                title="📝 하루의 끝, 당신의 이야기를 들려주세요"
                description="일기로 소통하는 따뜻한 커뮤니티에서 오늘 하루를 마무리해보세요!"
                buttonText="하루의 끝 방문하기"
                buttonLink="https://haru2end.com"
                backgroundColor="bg-gradient-to-r from-emerald-500 to-blue-600"
              />

              <section className="mb-4 md:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{getPageTitle()}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{getPageDescription()}</p>
              </section>

              <section className="space-y-3 md:space-y-4" aria-label="질문 목록">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((question, index) => (
                    <article key={question.id}>
                      <div
                        ref={(el) => {
                          questionRefs.current[question.id] = el
                        }}
                        className="transition-all duration-300"
                      >
                        <QuestionCard question={question} onContinueChain={() => {}} />
                      </div>

                      {(index + 1) % 3 === 0 && (
                        <aside className="my-4 md:my-6">
                          <BannerAd
                            title="💡 더 많은 질문을 찾고 계신가요?"
                            description="AI가 추천하는 맞춤형 질문으로 새로운 아이디어를 얻어보세요."
                            buttonText="AI 추천 보기"
                            buttonLink="#"
                            backgroundColor="bg-gradient-to-r from-purple-500 to-pink-600"
                            closeable={false}
                          />
                        </aside>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="text-center py-8 md:py-12 text-muted-foreground text-sm sm:text-base" role="status">
                    검색 결과가 없습니다.
                  </div>
                )}
              </section>

              {totalPages > 1 && (
                <footer className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handlePageChange(i + 1)
                            }}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </footer>
              )}
            </div>
          </main>
        </div>

        <Footer />

        {showQuestionForm && (
          <QuestionForm
            onClose={handleCloseQuestionForm}
            onSubmit={handleNewQuestion}
            prefilledData={prefilledQuestion}
          />
        )}
      </div>
    </>
  )
}

export interface Question {
  id: number
  title: string
  category: string
  author: string
  time: string
  chainCount: number
  lastQuestion?: string
  createdAt: number
}

export interface ChainItem {
  id: number
  parentId: number
  text: string
  author: string
  time: string
  level: number
  createdAt: number
  type: "question" | "answer" // 질문인지 답변인지 구분
}

export type ChainQuestion = ChainItem

export interface User {
  id: number
  username: string
  email: string
  password: string // 실제 프로덕션에서는 해시된 비밀번호 사용
  displayName: string
  bio?: string
  joinedAt: number
  avatar?: string
}

const QUESTIONS_KEY = "kkojil_questions"
const CHAINS_KEY = "kkojil_chains"
const USERS_KEY = "kkojil_users"
const CURRENT_USER_KEY = "kkojil_current_user"

// 질문 관련 함수들
export function getQuestions(): Question[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(QUESTIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load questions:", error)
    return []
  }
}

export function saveQuestions(questions: Question[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions))
  } catch (error) {
    console.error("Failed to save questions:", error)
  }
}

export function addQuestion(questionData: Omit<Question, "id" | "createdAt" | "chainCount">): Question {
  const questions = getQuestions()
  const newQuestion: Question = {
    ...questionData,
    id: Date.now(),
    createdAt: Date.now(),
    chainCount: 0,
  }

  const updatedQuestions = [newQuestion, ...questions]
  saveQuestions(updatedQuestions)
  return newQuestion
}

export function getCategoryStats(): Array<{ name: string; count: number; color: string }> {
  const questions = getQuestions()
  const categories = ["정치", "개발", "철학", "일상"]

  return categories.map((category) => {
    const count = questions.filter((q) => q.category === category).length
    const colors = {
      정치: "bg-red-100 text-red-800",
      개발: "bg-blue-100 text-blue-800",
      철학: "bg-purple-100 text-purple-800",
      일상: "bg-green-100 text-green-800",
    }

    return {
      name: category,
      count,
      color: colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800",
    }
  })
}

export function getQuestionsByCategory(category: string | null): Question[] {
  const questions = getQuestions()

  if (!category || category === "전체") {
    return questions
  }

  return questions.filter((q) => q.category === category)
}

export function getTrendingQuestions(): Question[] {
  if (typeof window === "undefined") return []

  try {
    const questions = getQuestions()

    return questions
      .map((question) => {
        const recencyScore = Math.max(0, 7 - Math.floor((Date.now() - question.createdAt) / (1000 * 60 * 60 * 24))) // 7일 이내 점수
        const popularityScore = question.chainCount * 2 + recencyScore
        return { ...question, popularityScore }
      })
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 4) // 상위 4개만 반환
  } catch (error) {
    console.error("Failed to get trending questions:", error)
    return []
  }
}

// 체인 관련 함수들
export function getChains(parentId: number): ChainItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(CHAINS_KEY)
    const allChains: ChainItem[] = stored ? JSON.parse(stored) : []
    return allChains.filter((chain) => chain.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt)
  } catch (error) {
    console.error("Failed to load chains:", error)
    return []
  }
}

export function saveChain(chainData: Omit<ChainItem, "id" | "createdAt">): ChainItem {
  if (typeof window === "undefined") return chainData as ChainItem

  try {
    const stored = localStorage.getItem(CHAINS_KEY)
    const allChains: ChainItem[] = stored ? JSON.parse(stored) : []

    const newChain: ChainItem = {
      ...chainData,
      id: Date.now(),
      createdAt: Date.now(),
    }

    const updatedChains = [...allChains, newChain]
    localStorage.setItem(CHAINS_KEY, JSON.stringify(updatedChains))

    // 부모 질문의 체인 카운트 업데이트
    updateQuestionChainCount(chainData.parentId)

    return newChain
  } catch (error) {
    console.error("Failed to save chain:", error)
    return chainData as ChainItem
  }
}

function updateQuestionChainCount(questionId: number): void {
  const questions = getQuestions()
  const updatedQuestions = questions.map((q) => {
    if (q.id === questionId) {
      const chains = getChains(questionId)
      return { ...q, chainCount: chains.length + 1 }
    }
    return q
  })
  saveQuestions(updatedQuestions)
}

// 사용자 관련 함수들
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load users:", error)
    return []
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Failed to save users:", error)
  }
}

export function registerUser(userData: Omit<User, "id" | "joinedAt">): User | null {
  const users = getUsers()

  // 이메일 중복 확인
  if (users.some((user) => user.email === userData.email)) {
    return null
  }

  // 사용자명 중복 확인
  if (users.some((user) => user.username === userData.username)) {
    return null
  }

  const newUser: User = {
    ...userData,
    id: Date.now(),
    joinedAt: Date.now(),
  }

  const updatedUsers = [...users, newUser]
  saveUsers(updatedUsers)
  return newUser
}

export function loginUser(email: string, password: string): User | null {
  if (typeof window === "undefined") return null
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  }

  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function updateUser(updatedUser: User): void {
  if (typeof window === "undefined") return

  const users = getUsers()
  const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
  saveUsers(updatedUsers)

  // 현재 사용자 정보도 업데이트
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === updatedUser.id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
  }
}

export function checkUsernameAvailability(username: string): boolean {
  const users = getUsers()
  return !users.some((user) => user.username === username)
}

// 시간 포맷팅 유틸리티
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

// 초기 데이터 설정
export function initializeDefaultData(): void {
  if (typeof window === "undefined") return

  const existingQuestions = getQuestions()
  if (existingQuestions.length === 0) {
    const defaultQuestions: Question[] = [
      {
        id: 1,
        title: "개발자가 되기 위해 가장 중요한 것은 무엇일까요?",
        category: "개발",
        author: "코딩초보",
        time: "2시간 전",
        chainCount: 5,
        lastQuestion: "그렇다면 어떤 언어부터 시작해야 할까요?",
        createdAt: Date.now() - 2 * 60 * 60 * 1000,
      },
      {
        id: 2,
        title: "인공지능이 인간의 창의성을 대체할 수 있을까요?",
        category: "철학",
        author: "생각하는사람",
        time: "4시간 전",
        chainCount: 3,
        lastQuestion: "창의성의 본질은 무엇인가요?",
        createdAt: Date.now() - 4 * 60 * 60 * 1000,
      },
      {
        id: 3,
        title: "현재 정치 상황에서 가장 중요한 이슈는?",
        category: "정치",
        author: "시민의식",
        time: "6시간 전",
        chainCount: 8,
        lastQuestion: "이슈는 다양하지만, 가장 큰 문제는 경제적 불평등입니다.",
        createdAt: Date.now() - 6 * 60 * 60 * 1000,
      },
      {
        id: 4,
        title: "여러분은 \"번아웃\"을 어떻게 극복하시나요?",
        category: "일상",
        author: "지친직장인",
        time: "8시간 전",
        chainCount: 12,
        lastQuestion: "휴식과 일의 밸런스를 맞추는 팁이 있나요?",
        createdAt: Date.now() - 8 * 60 * 60 * 1000,
      },
      {
        id: 5,
        title: "프론트엔드와 백엔드, 둘 중 어떤 것을 먼저 배우는게 좋을까요?",
        category: "개발",
        author: "진로고민",
        time: "1일 전",
        chainCount: 15,
        lastQuestion: "풀스택 개발자의 현실적인 장단점은 무엇인가요?",
        createdAt: Date.now() - 24 * 60 * 60 * 1000,
      },
      {
        id: 6,
        title: "만약 인생을 다시 살 수 있다면, 다른 선택을 하시겠습니까?",
        category: "철학",
        author: "이프",
        time: "2일 전",
        chainCount: 20,
        lastQuestion: "과거의 후회가 현재의 나를 만든 것 아닐까요?",
        createdAt: Date.now() - 48 * 60 * 60 * 1000,
      },
    ]
    saveQuestions(defaultQuestions)
  }
}

export function getRecentContent(): Array<{
  type: "question" | "answer"
  content: string
  time: string
  author: string
}> {
  if (typeof window === "undefined") return []

  try {
    const questions = getQuestions()
    const allChains: ChainItem[] = JSON.parse(localStorage.getItem(CHAINS_KEY) || "[]")

    // 모든 질문과 답변을 하나의 배열로 합치기
    const allContent = [
      ...questions.map((q) => ({
        type: "question" as const,
        content: q.title,
        time: q.time,
        author: q.author,
        createdAt: q.createdAt,
      })),
      ...allChains.map((c) => ({
        type: c.type,
        content: c.text,
        time: c.time,
        author: c.author,
        createdAt: c.createdAt,
      })),
    ]

    // 최신순으로 정렬하고 상위 5개만 반환
    return allContent
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(({ type, content, time, author }) => ({ type, content, time, author }))
  } catch (error) {
    console.error("Failed to load recent content:", error)
    return []
  }
}

export function searchQuestions(query: string): Question[] {
  if (typeof window === "undefined") return []

  try {
    const questions = getQuestions()
    const lowercaseQuery = query.toLowerCase()

    return questions.filter(
      (question) =>
        question.title.toLowerCase().includes(lowercaseQuery) ||
        question.category.toLowerCase().includes(lowercaseQuery) ||
        question.author.toLowerCase().includes(lowercaseQuery),
    )
  } catch (error) {
    console.error("Failed to search questions:", error)
    return []
  }
}

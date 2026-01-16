export interface Question {
  id: number
  title: string
  category: string
  author: string
  time: string
  chainCount: number
  lastQuestion?: string
  createdAt: number
  views?: number
  replies?: number
  tags?: string[]
}

export interface ChainItem {
  id: number
  parentId: number
  text: string
  author: string
  time: string
  level: number
  createdAt: number
  type: "question" | "answer"
}

export type ChainQuestion = ChainItem

export interface User {
  id: number
  username: string
  email: string
  password: string
  displayName: string
  bio?: string
  joinedAt: number
  avatar?: string
  isAuthenticated?: boolean
}

export interface SearchFilters {
  query: string
  category: string | null
  sortBy: "newest" | "popular" | "replies"
}

export interface UIState {
  sidebarOpen: boolean
  showQuestionForm: boolean
  prefilledQuestion: { text: string; category: string } | null
}

export interface BannerAdProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundColor: string
  closeable?: boolean
}

export type Category =
  | "정치"
  | "개발"
  | "철학"
  | "일상"
  | "일반"
  | "기술"
  | "취미"
  | "학습"
  | "생활"
  | "건강"
  | "여행"
  | "음식"
  | "문화"
  | "기타"

export interface QuestionFormData {
  title: string
  category: Category
  content?: string
}

export interface CategoryStats {
  name: string
  count: number
  color: string
}

export interface RecentContent {
  type: "question" | "answer"
  content: string
  time: string
  author: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Hook return types
export interface UseQuestionsReturn {
  questions: Question[]
  filteredQuestions: Question[]
  loading: boolean
  error: string | null
  addQuestion: (data: Omit<Question, "id" | "createdAt" | "chainCount">) => Question
  searchQuestions: (query: string) => void
  filterByCategory: (category: string | null) => void
  refreshQuestions: () => void
}

export interface UseUIStateReturn extends Omit<UIState, 'selectedChain'> {
  setSidebarOpen: (open: boolean) => void
  setShowQuestionForm: (show: boolean) => void
  setPrefilledQuestion: (data: { text: string; category: string } | null) => void
  resetState: () => void
}

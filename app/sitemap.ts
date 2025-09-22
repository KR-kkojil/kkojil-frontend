import type { MetadataRoute } from "next"
import { getQuestions } from "@/lib/storage"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kkojil.com"

  // 참고: 현재 getQuestions() 함수는 브라우저의 localStorage에서 데이터를 읽어옵니다.
  // 빌드 시점에 사이트맵이 올바르게 생성되려면, 이 함수가 DB나 JSON 파일 등
  // 서버에서 접근 가능한 데이터 소스에서 질문 목록을 가져오도록 수정해야 합니다.
  const questions = getQuestions()

  const questionRoutes = questions.map((question) => ({
    url: `${baseUrl}/questions/${question.id}`,
    lastModified: new Date(question.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  return [...staticRoutes, ...questionRoutes]
}

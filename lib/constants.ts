export const CATEGORIES = ["정치", "개발", "철학", "일상"] as const

export type Category = (typeof CATEGORIES)[number]

export const getCategoryColor = (category: string) => {
  const colors = {
    정치: "bg-red-100 text-red-800 hover:bg-red-200",
    개발: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    철학: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    일상: "bg-green-100 text-green-800 hover:bg-green-200",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

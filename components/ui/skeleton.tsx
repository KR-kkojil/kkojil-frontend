import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export { Skeleton }

// 질문 카드용 스켈레톤
export function QuestionCardSkeleton() {
  return (
    <div className="p-3 sm:p-4 md:p-6 border rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-3" />

      <div className="bg-muted/50 rounded-lg p-2 sm:p-3 mb-3">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

// 사이드바용 스켈레톤
export function SidebarSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

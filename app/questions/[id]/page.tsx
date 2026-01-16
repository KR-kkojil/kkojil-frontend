"use client"

import { useParams } from "next/navigation"

export default function QuestionPage() {
  const params = useParams()
  const { id } = params

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Question Details</h1>
      <p>Question ID: {id}</p>
    </div>
  )
}

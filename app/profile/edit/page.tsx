"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { updateUser } from "@/lib/storage"
import Link from "next/link"
import Image from "next/image"

export default function EditProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    displayName: "",
  })
  const [profileImage, setProfileImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      setFormData({
        displayName: user.displayName,
      })
      setProfileImage(user.avatar || "")
    }
  }, [user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("이미지 크기는 5MB 이하여야 합니다.")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    if (!formData.displayName.trim()) {
      setError("표시 이름은 필수입니다.")
      setIsSaving(false)
      return
    }

    if (user) {
      const updatedUser = {
        ...user,
        displayName: formData.displayName.trim(),
        avatar: profileImage,
      }

      updateUser(updatedUser)
      setSuccess("프로필이 성공적으로 업데이트되었습니다.")

      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    }

    setIsSaving(false)
  }

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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                프로필로 돌아가기
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>프로필 수정</CardTitle>
              <CardDescription>다른 사용자에게 보여질 정보를 수정할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label>프로필 이미지</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {profileImage ? (
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="프로필 이미지"
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-border aspect-square"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="profileImage" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                          <Upload className="h-4 w-4" />
                          이미지 업로드
                        </div>
                      </Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG 파일 (최대 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">표시 이름 *</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="다른 사용자에게 보여질 이름"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "저장 중..." : "저장하기"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/profile">취소</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

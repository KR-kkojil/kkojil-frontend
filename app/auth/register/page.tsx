"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Check, X, ArrowLeft } from "lucide-react"
import { registerUser, checkUsernameAvailability } from "@/lib/storage"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailCode: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailCode, setShowEmailCode] = useState(false)
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const router = useRouter()

  const checkUsername = async (username: string) => {
    if (username.length < 2) {
      setUsernameStatus("idle")
      return
    }

    setUsernameStatus("checking")

    setTimeout(() => {
      const isAvailable = checkUsernameAvailability(username)
      setUsernameStatus(isAvailable ? "available" : "taken")
    }, 500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "email" && value.includes("@") && value.includes(".")) {
      setShowEmailCode(true)
    } else if (name === "email") {
      setShowEmailCode(false)
      setEmailCodeSent(false)
    }

    if (name === "username") {
      checkUsername(value)
    }
  }

  const sendEmailCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)
    setEmailCodeSent(true)
    alert(`인증 코드가 발송되었습니다: ${code}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("필수 항목을 모두 입력해주세요.")
      setIsLoading(false)
      return
    }

    if (usernameStatus === "taken") {
      setError("이미 사용 중인 사용자명입니다.")
      setIsLoading(false)
      return
    }

    if (showEmailCode && (!formData.emailCode || formData.emailCode !== generatedCode)) {
      setError("이메일 인증 코드가 올바르지 않습니다.")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      setIsLoading(false)
      return
    }

    const user = registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      displayName: formData.username,
    })

    if (user) {
      router.push("/auth/login")
    } else {
      setError("이미 사용 중인 이메일 또는 사용자명입니다.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">회원가입</CardTitle>
          <CardDescription>꼬질 포질모임에 참여하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">사용자명 *</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="사용자명을 입력하세요"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {usernameStatus === "available" && <Check className="w-4 h-4 text-green-500" />}
                  {usernameStatus === "taken" && <X className="w-4 h-4 text-red-500" />}
                </div>
              </div>
              {usernameStatus === "available" && <p className="text-sm text-green-600">사용 가능한 사용자명입니다.</p>}
              {usernameStatus === "taken" && <p className="text-sm text-red-600">이미 사용 중인 사용자명입니다.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {showEmailCode && (
              <div className="space-y-2">
                <Label htmlFor="emailCode">이메일 인증 코드 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="emailCode"
                    name="emailCode"
                    type="text"
                    placeholder="인증 코드 6자리"
                    value={formData.emailCode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendEmailCode}
                    disabled={emailCodeSent}
                    className="whitespace-nowrap bg-transparent"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {emailCodeSent ? "발송됨" : "발송"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

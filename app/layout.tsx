import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: "꼬질꼬질 - 당신의 모든 궁금증이 해결되는 곳",
    template: "%s | 꼬질꼬질",
  },
  description:
    "코딩, 커리어, 일상 등 어떤 질문이든 던져보세요. 꼬질꼬질 커뮤니티의 집단 지성이 당신의 궁금증을 해결해 드립니다. 지금 바로 참여하여 지식을 나누고 얻으세요.",
  keywords: ["질문", "답변", "커뮤니티", "Q&A", "프로그래밍", "학습", "취업", "일상", "궁금증", "지식공유", "개발자", "커리어"],
  authors: [{ name: "꼬질꼬질 팀", url: "https://kkojil.com" }],
  creator: "꼬질꼬질",
  publisher: "꼬질꼬질",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kkojil.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://kkojil.com",
    title: "꼬질꼬질 - 당신의 모든 궁금증이 해결되는 곳",
    description: "코딩, 커리어, 일상 등 어떤 질문이든 던져보세요. 꼬질꼬질 커뮤니티가 해결해 드립니다.",
    siteName: "꼬질꼬질",
    images: [
      {
        url: "/logo.png",
        width: 256,
        height: 256,
        alt: "꼬질꼬질 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "꼬질꼬질 - 당신의 모든 궁금증이 해결되는 곳",
    description: "코딩, 커리어, 일상 등 어떤 질문이든 던져보세요. 꼬질꼬질 커뮤니티가 해결해 드립니다.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    other: {
      "naver-site-verification": "your-naver-verification-code",
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "꼬질꼬질",
              description: "궁금한 것들을 자유롭게 질문하고 답변하는 한국 최대 Q&A 커뮤니티",
              url: "https://kkojil.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://kkojil.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "꼬질꼬질",
                url: "https://kkojil.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://kkojil.com/logo.png",
                },
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

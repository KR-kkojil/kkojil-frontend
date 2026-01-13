import { Instagram, Github, Youtube } from "lucide-react"

export function Footer() {
  const socialLinks = [
    {
      name: "인스타그램",
      icon: Instagram,
      href: "https://www.instagram.com/bear_game123",
      color: "hover:text-pink-500",
    },
    {
      name: "깃허브",
      icon: Github,
      href: "https://github.com/beargame123",
      color: "hover:text-gray-600",
    },
    {
      name: "유튜브",
      icon: Youtube,
      href: "https://www.youtube.com/@bear_game123",
      color: "hover:text-red-500",
    },
  ]

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-muted-foreground transition-colors ${link.color}`}
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">{link.name}</span>
                </a>
              )
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2026 꼬질꼬질. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

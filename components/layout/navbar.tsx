"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Music, Users, Calendar, CreditCard, Home } from "lucide-react"

const navigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Instrumentos", href: "/instrumentos", icon: Music },
  { name: "Alunos", href: "/alunos", icon: Users },
  { name: "Chamada", href: "/chamada", icon: Calendar },
  { name: "Pagamentos", href: "/pagamentos", icon: CreditCard },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logoemads.png" alt="Logo da Escola de Música" width={180} height={150} />
            <span className="text-xl font-bold text-foreground">Assembleia de Deus Seara</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
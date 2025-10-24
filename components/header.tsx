"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const currentUser = useStore((state) => state.currentUser)
  const logout = useStore((state) => state.logout)
  const pathname = usePathname()

  const navItems = [
    { href: "/check-in", label: "Check-in" },
    { href: "/tracking", label: "Seguimiento" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
            P3
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Parke tr3s
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={pathname === item.href ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Hola, {currentUser.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden border-t">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-around">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={pathname === item.href ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

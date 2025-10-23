"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { LogOut, User, Clock } from "lucide-react"

export function Header() {
  const currentUser = useStore((state) => state.currentUser)
  const logout = useStore((state) => state.logout)

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
            P3
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Parke tr3s
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm text-muted-foreground">Hola, {currentUser.username}</span>
              {currentUser.role === "admin" && (
                <>
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                  <Link href="/tracking">
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Seguimiento
                    </Button>
                  </Link>
                  <Link href="/check-in">
                    <Button variant="outline" size="sm">
                      Check-in
                    </Button>
                  </Link>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

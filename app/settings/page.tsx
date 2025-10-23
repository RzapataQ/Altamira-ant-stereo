"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const currentUser = useStore((state) => state.currentUser)
  const changePassword = useStore((state) => state.changePassword)
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Redirect if not logged in
  if (!currentUser) {
    router.push("/login?redirect=/settings")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validate current password
    if (currentPassword !== currentUser.password) {
      setError("La contraseña actual es incorrecta")
      return
    }

    // Validate new password
    if (newPassword.length < 4) {
      setError("La nueva contraseña debe tener al menos 4 caracteres")
      return
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Change password
    const updated = changePassword(currentUser.id, newPassword)
    if (updated) {
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError("Error al cambiar la contraseña")
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={currentUser.role === "admin" ? "/admin" : "/"}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
            <CardDescription>Administra tu información y seguridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Usuario</h3>
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Usuario</Label>
                  <p className="font-medium">{currentUser.username}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Rol</Label>
                  <p className="font-medium capitalize">{currentUser.role}</p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">{error}</div>
                )}

                {success && (
                  <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Contraseña actualizada exitosamente
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Cambiar Contraseña
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

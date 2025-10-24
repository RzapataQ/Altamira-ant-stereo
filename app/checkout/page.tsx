"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TIME_PACKAGES } from "@/lib/mock-data"
import { useEffect } from "react"

export default function CheckoutPage() {
  const router = useRouter()
  const { currentChild, currentGuardian, selectedTimePackage, currentUser } = useStore()

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "worker")) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (!currentChild || !currentGuardian || !selectedTimePackage) {
      router.push("/register")
    }
  }, [currentChild, currentGuardian, selectedTimePackage, currentUser, router])

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "worker")) {
    return null
  }

  if (!currentChild || !currentGuardian || !selectedTimePackage) {
    return null
  }

  const selectedPackage = TIME_PACKAGES.find((pkg) => pkg.id === selectedTimePackage)

  if (!selectedPackage) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleProceedToPayment = () => {
    router.push("/payment")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/register"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al registro
        </Link>

        <h1 className="text-3xl font-bold mb-8">Resumen de Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Niño/a</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{currentChild.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edad:</span>
                  <span className="font-medium">{currentChild.age} años</span>
                </div>
                {currentChild.allergies && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alergias:</span>
                    <span className="font-medium">{currentChild.allergies}</span>
                  </div>
                )}
                {currentChild.specialNeeds && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Necesidades especiales:</span>
                    <span className="font-medium text-sm">{currentChild.specialNeeds}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Acudiente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{currentGuardian.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{currentGuardian.phone}</span>
                </div>
                {currentGuardian.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{currentGuardian.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Relación:</span>
                  <span className="font-medium">{currentGuardian.relationship}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paquete de Tiempo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{selectedPackage.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedPackage.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-primary">{formatPrice(selectedPackage.price)}</div>
                    <div className="text-xs text-muted-foreground">{selectedPackage.minutes} minutos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Notificaciones por WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recibirás una notificación por WhatsApp al número <strong>{currentGuardian.phone}</strong> cuando
                  queden 5 minutos de tiempo restante.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Total a Pagar</CardTitle>
                <CardDescription>Resumen de tu compra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedPackage.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (19%)</span>
                    <span>{formatPrice(selectedPackage.price * 0.19)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(selectedPackage.price * 1.19)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button onClick={handleProceedToPayment} className="w-full" size="lg">
                    Proceder al Pago
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/register")} className="w-full">
                    Editar Información
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Al continuar, aceptas nuestros términos y condiciones de servicio
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

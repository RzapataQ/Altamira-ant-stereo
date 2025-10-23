"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useStore } from "@/lib/store"
import { CreditCard, Wallet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TIME_PACKAGES } from "@/lib/mock-data"
import { generateQRData } from "@/lib/qr-generator"
import type { Visitor } from "@/lib/types"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [processing, setProcessing] = useState(false)

  const { currentChild, currentGuardian, selectedTimePackage, addVisitor, addPurchase, clearRegistration } = useStore()

  useEffect(() => {
    if (!currentChild || !currentGuardian || !selectedTimePackage) {
      router.push("/register")
    }
  }, [currentChild, currentGuardian, selectedTimePackage, router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const visitorId = `V${Date.now()}`
    const paymentMethodText = paymentMethod === "credit-card" ? "Tarjeta de crédito" : "Efectivo/Nequi"

    const visitor: Visitor = {
      id: visitorId,
      child: currentChild,
      guardian: currentGuardian,
      timePackage: selectedTimePackage,
      totalMinutes: selectedPackage.minutes,
      remainingMinutes: selectedPackage.minutes,
      initialMinutes: selectedPackage.minutes,
      registrationDate: new Date(),
      status: "registered",
      paymentMethod: paymentMethodText,
      qrData: "", // Will be generated after visitor is created
      whatsappSent5min: false,
      speakerActivated5min: false,
      recharges: 0,
      alertActive: false,
    }

    visitor.qrData = generateQRData(visitor)

    addVisitor(visitor)

    const purchase = {
      id: `P${Date.now()}`,
      visitor,
      amount: selectedPackage.price * 1.19,
      paymentMethod: paymentMethodText,
      createdAt: new Date(),
      status: "completed" as const,
    }

    addPurchase(purchase)
    clearRegistration()
    router.push(`/success?visitorId=${visitor.id}`)
  }

  const subtotal = selectedPackage.price
  const vat = subtotal * 0.19
  const total = subtotal + vat

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link
          href="/checkout"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al resumen
        </Link>

        <h1 className="text-3xl font-bold mb-8">Método de Pago</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona tu método de pago</CardTitle>
              <CardDescription>Todos los pagos son seguros y encriptados</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Tarjeta de Crédito/Débito</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">Efectivo / Nequi / Daviplata</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {paymentMethod === "credit-card" && (
            <Card>
              <CardHeader>
                <CardTitle>Información de la Tarjeta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    placeholder="JUAN PÉREZ"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                  Esta es una demo. Puedes usar cualquier número de tarjeta para probar.
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "paypal" && (
            <Card>
              <CardContent className="pt-6">
                <div className="bg-muted p-6 rounded-md text-center space-y-3">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Puedes pagar en efectivo en recepción o mediante transferencia a Nequi/Daviplata.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paquete:</span>
                <span className="font-medium">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (19%)</span>
                <span>{formatPrice(vat)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total a Pagar</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={processing}>
            {processing ? "Procesando pago..." : `Pagar ${formatPrice(total)}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al completar el pago, recibirás tu código QR de acceso inmediatamente
          </p>
        </form>
      </div>
    </div>
  )
}

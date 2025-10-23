"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { parseQRData, isQRFromToday, formatQRDate } from "@/lib/qr-generator"
import { ArrowLeft, CheckCircle2, XCircle, QrCode, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CheckInPage() {
  const [qrInput, setQrInput] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; visitor?: any; isOldQR?: boolean } | null>(
    null,
  )
  const { visitors, startSession } = useStore()

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault()
    setScanning(true)
    setResult(null)

    setTimeout(() => {
      const parsed = parseQRData(qrInput)

      if (!parsed) {
        setResult({
          success: false,
          message: "Código QR inválido. Por favor verifica el código.",
        })
        setScanning(false)
        return
      }

      if (!isQRFromToday(parsed.date)) {
        const qrDate = formatQRDate(parsed.date)
        setResult({
          success: false,
          message: `Este QR ya no es válido porque es de una fecha anterior (${qrDate}). Por favor compra una nueva entrada para hoy.`,
          isOldQR: true,
        })
        setScanning(false)
        return
      }

      const visitor = visitors.find((v) => v.id === parsed.visitorId)

      if (!visitor) {
        setResult({
          success: false,
          message: "No se encontró ninguna entrada con este código.",
        })
        setScanning(false)
        return
      }

      if (visitor.status === "finished") {
        setResult({
          success: false,
          message: "Esta entrada ya ha sido utilizada y el tiempo ha finalizado.",
          visitor,
        })
        setScanning(false)
        return
      }

      if (visitor.status === "active") {
        setResult({
          success: true,
          message: "Entrada válida. El visitante ya está activo en el parque.",
          visitor,
        })
        setScanning(false)
        return
      }

      startSession(visitor.id)

      setResult({
        success: true,
        message: "Entrada válida. Acceso concedido.",
        visitor,
      })
      setScanning(false)
      setQrInput("")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check-In de Visitantes</h1>
          <p className="text-muted-foreground">Escanea o ingresa el código QR para dar acceso</p>
        </div>

        <Alert className="mb-6 border-blue-500 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Validación de Fecha</AlertTitle>
          <AlertDescription className="text-blue-700">
            Solo se aceptan códigos QR generados el día de hoy. Los códigos de fechas anteriores serán rechazados
            automáticamente.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Escanear Código QR</CardTitle>
            <CardDescription>Ingresa el código QR del visitante para validar su entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qrCode">Código QR</Label>
                <Input
                  id="qrCode"
                  placeholder="PARKETR3S-XXX-XXXXXXXX-..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  El código incluye información del niño, acudiente, tiempo y pago
                </p>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={scanning}>
                {scanning ? "Validando..." : "Validar Entrada"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card
            className={
              result.isOldQR
                ? "border-orange-500 bg-orange-50"
                : result.success
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.isOldQR ? "bg-orange-100" : result.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {result.isOldQR ? (
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  ) : result.success ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      result.isOldQR ? "text-orange-900" : result.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {result.isOldQR ? "QR de Fecha Anterior" : result.success ? "Acceso Permitido" : "Acceso Denegado"}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      result.isOldQR ? "text-orange-700" : result.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.message}
                  </p>

                  {result.visitor && (
                    <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Niño/a:</span>
                        <span className="font-medium">{result.visitor.child.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Edad:</span>
                        <span className="font-medium">{result.visitor.child.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Acudiente:</span>
                        <span className="font-medium">{result.visitor.guardian.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="font-medium">{result.visitor.guardian.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo:</span>
                        <span className="font-medium">{result.visitor.remainingMinutes} min restantes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Método de Pago:</span>
                        <span className="font-medium">{result.visitor.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <span className="font-medium capitalize">{result.visitor.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Solicita al visitante que muestre su código QR</p>
            <p>2. Escanea el código o ingrésalo manualmente</p>
            <p>3. El sistema validará que el QR sea del día de hoy</p>
            <p>4. Verifica la información del visitante</p>
            <p>5. Permite el acceso si la validación es exitosa</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

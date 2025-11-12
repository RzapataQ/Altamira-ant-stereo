"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { CheckCircle2, Download, Home, Clock, Printer } from "lucide-react"
import Link from "next/link"
import { generateQRCodeURL } from "@/lib/qr-generator"
import Image from "next/image"
import { addPendingPurchase } from "@/lib/qr-validation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const visitorId = searchParams.get("visitorId")
  const visitors = useStore((state) => state.visitors)
  const addVisitor = useStore((state) => state.addVisitor)
  const updateVisitor = useStore((state) => state.updateVisitor)
  const [visitor, setVisitor] = useState<(typeof visitors)[0] | null>(null)

  useEffect(() => {
    console.log("[v0] Success page - Looking for visitor ID:", visitorId)
    console.log("[v0] Success page - Total visitors in store:", visitors.length)

    if (visitorId) {
      let found = visitors.find((v) => v.id === visitorId)

      if (found && !found.qrData) {
        console.log("[v0] Visitor found but missing QR data, generating and saving...")
        const { generateQRData } = require("@/lib/qr-generator")
        const qrData = generateQRData(found)
        found = { ...found, qrData }
        updateVisitor(visitorId, { qrData })
      }

      if (found) {
        console.log("[v0] Success page - Visitor found:", found.id)
        console.log("[v0] Success page - QR data:", found.qrData)
        setVisitor(found)

        addPendingPurchase({
          id: `pending-${Date.now()}`,
          visitorId: found.id,
          qrCode: found.qrData,
          childName: found.child.name,
          guardianName: found.guardian.name,
          guardianPhone: found.guardian.phone,
          status: "pending",
          createdAt: new Date(),
        })
      } else {
        console.log("[v0] Success page - Visitor NOT found, redirecting to home")
        router.push("/")
      }
    } else {
      console.log("[v0] Success page - No visitor ID in URL, redirecting to home")
      router.push("/")
    }
  }, [visitorId, visitors, router, addVisitor, updateVisitor])

  if (!visitor) {
    return null
  }

  const qrCodeUrl = generateQRCodeURL(visitor.qrData)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `parke-tr3s-${visitor.child.name.replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintCard = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="print-only">
        <div className="printable-card">
          <div className="card-header">
            <h1>PARKE TR3S</h1>
            <p className="card-subtitle">Pase de Entrada</p>
          </div>

          <div className="qr-section">
            <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" width={200} height={200} className="qr-image" />
          </div>

          <div className="card-info">
            <div className="info-row">
              <span className="label">Niño/a:</span>
              <span className="value">{visitor.child.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Edad:</span>
              <span className="value">{visitor.child.age} años</span>
            </div>
            <div className="info-row">
              <span className="label">Acudiente:</span>
              <span className="value">{visitor.guardian.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Teléfono:</span>
              <span className="value">{visitor.guardian.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Tiempo:</span>
              <span className="value">{visitor.totalMinutes} min</span>
            </div>
            <div className="info-row">
              <span className="label">Pago:</span>
              <span className="value">{visitor.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span className="label">Fecha:</span>
              <span className="value">{new Date(visitor.registrationDate).toLocaleDateString("es-CO")}</span>
            </div>
          </div>

          <div className="card-footer">
            <p className="qr-code-text">{visitor.qrData}</p>
            <p className="footer-note">Presente este pase en la entrada del parque</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl no-print">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-balance">Compra Exitosa</h1>
          <p className="text-lg text-muted-foreground">Tu entrada ha sido generada correctamente</p>
        </div>

        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tu Código QR de Acceso</CardTitle>
            <CardDescription>Presenta este código en la entrada del parque</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Image
                src={qrCodeUrl || "/placeholder.svg"}
                alt="QR Code"
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-sm text-muted-foreground">{visitor.qrData}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleDownloadQR} variant="outline" size="lg" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Descargar QR
                </Button>
                <Button onClick={handlePrintCard} variant="default" size="lg" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir Tarjeta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Niño/a</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{visitor.child.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edad:</span>
                <span className="font-medium">{visitor.child.age} años</span>
              </div>
              {visitor.child.allergies && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alergias:</span>
                  <span className="font-medium text-sm">{visitor.child.allergies}</span>
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
                <span className="font-medium">{visitor.guardian.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{visitor.guardian.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relación:</span>
                <span className="font-medium">{visitor.guardian.relationship}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-accent/10 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Tiempo Comprado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-accent">{visitor.totalMinutes} minutos</p>
                <p className="text-sm text-muted-foreground">de diversión en Parke tr3s</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Paquete</p>
                <p className="font-semibold">{visitor.timePackage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Método de Pago:</span>
              <span className="font-semibold text-lg">{visitor.paymentMethod}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-secondary/10 border-secondary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Notificaciones por WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Recibirás una notificación al número <strong>{visitor.guardian.phone}</strong> cuando queden 5 minutos
                  de tiempo restante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
          <Button className="flex-1" onClick={handlePrintCard}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Tarjeta
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Guarda este código QR en tu teléfono o imprímelo para presentarlo en la entrada
        </p>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
        
        @media screen {
          .print-only {
            display: none;
          }
        }
        
        .printable-card {
          width: 85mm;
          height: 130mm;
          margin: 0 auto;
          padding: 8mm;
          border: 2px solid #333;
          border-radius: 8px;
          background: white;
          color: #000;
          font-family: Arial, sans-serif;
          page-break-after: always;
          box-sizing: border-box;
        }
        
        .card-header {
          text-align: center;
          border-bottom: 2px solid #ff6b35;
          padding-bottom: 4mm;
          margin-bottom: 4mm;
        }
        
        .card-header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #ff6b35;
          margin: 0 0 2mm 0;
          letter-spacing: 2px;
        }
        
        .card-subtitle {
          font-size: 12px;
          color: #666;
          margin: 0;
          text-transform: uppercase;
        }
        
        .qr-section {
          display: flex;
          justify-content: center;
          margin: 4mm 0;
          background: white;
          padding: 3mm;
          border-radius: 4px;
        }
        
        .qr-image {
          width: 40mm !important;
          height: 40mm !important;
        }
        
        .card-info {
          margin: 4mm 0;
          font-size: 10px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 1.5mm 0;
          border-bottom: 1px solid #eee;
        }
        
        .info-row .label {
          font-weight: bold;
          color: #333;
        }
        
        .info-row .value {
          color: #000;
          text-align: right;
        }
        
        .card-footer {
          margin-top: 4mm;
          padding-top: 3mm;
          border-top: 2px solid #ff6b35;
          text-align: center;
        }
        
        .qr-code-text {
          font-family: monospace;
          font-size: 8px;
          color: #666;
          margin: 0 0 2mm 0;
          word-break: break-all;
        }
        
        .footer-note {
          font-size: 9px;
          color: #333;
          margin: 0;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log("[v0] QR Code scanned:", decodedText)
            onScan(decodedText)
            stopScanner()
          },
          (errorMessage) => {
            // Ignore scanning errors (they happen continuously while scanning)
          },
        )

        setIsScanning(true)
      } catch (err) {
        console.error("[v0] Error starting scanner:", err)
        setError("No se pudo acceder a la cámara. Por favor verifica los permisos.")
      }
    }

    startScanner()

    return () => {
      stopScanner()
    }
  }, [])

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (err) {
        console.error("[v0] Error stopping scanner:", err)
      }
    }
    setIsScanning(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Escanear Código QR
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 text-sm">{error}</div>
        ) : (
          <>
            <div id="qr-reader" className="rounded-lg overflow-hidden mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              Apunta la cámara hacia el código QR para escanearlo
            </p>
          </>
        )}
      </div>
    </div>
  )
}

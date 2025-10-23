import type { Visitor } from "./types"

export function generateQRData(visitor: Visitor): string {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "")
  // Format: PARKETR3S-{visitorId}-{date}-{childName}-{guardianName}-{minutes}-{paymentMethod}
  const childName = visitor.child.name.replace(/\s+/g, "").substring(0, 10)
  const guardianName = visitor.guardian.name.replace(/\s+/g, "").substring(0, 10)
  const paymentShort = visitor.paymentMethod.includes("Tarjeta") ? "TC" : "EF"

  return `PARKETR3S-${visitor.id}-${date}-${childName}-${guardianName}-${visitor.totalMinutes}min-${paymentShort}`
}

export function generateQRCodeURL(qrData: string): string {
  // Using a QR code API service
  const encodedData = encodeURIComponent(qrData)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
}

export function parseQRData(qrData: string): {
  parkId: string
  visitorId: string
  date: string
  childName: string
  guardianName: string
  minutes: string
  paymentMethod: string
} | null {
  const parts = qrData.split("-")
  if (parts.length !== 7 || parts[0] !== "PARKETR3S") {
    return null
  }
  return {
    parkId: parts[0],
    visitorId: parts[1],
    date: parts[2],
    childName: parts[3],
    guardianName: parts[4],
    minutes: parts[5],
    paymentMethod: parts[6],
  }
}

export function isQRFromToday(qrDate: string): boolean {
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "")
  return qrDate === today
}

export function formatQRDate(qrDate: string): string {
  // qrDate format: YYYYMMDD
  const year = qrDate.substring(0, 4)
  const month = qrDate.substring(4, 6)
  const day = qrDate.substring(6, 8)
  return `${day}/${month}/${year}`
}

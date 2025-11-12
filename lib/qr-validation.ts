export interface PendingPurchase {
  id: string
  visitorId: string
  qrCode: string
  childName: string
  guardianName: string
  guardianPhone: string
  status: "pending" | "validated" | "expired"
  createdAt: Date
  validatedAt?: Date
  validatedBy?: string
}

// In-memory storage for pending purchases (shared across session)
let pendingPurchases: PendingPurchase[] = []

export const addPendingPurchase = (purchase: PendingPurchase) => {
  pendingPurchases = [...pendingPurchases, purchase]
  console.log("[v0] Pending purchase added:", purchase)
  return purchase
}

export const getPendingPurchases = (): PendingPurchase[] => {
  return pendingPurchases
}

export const validatePurchase = (
  qrCode: string,
  validatedBy: string,
): { success: boolean; message: string; purchase?: PendingPurchase } => {
  const purchase = pendingPurchases.find((p) => p.qrCode === qrCode && p.status === "pending")

  if (!purchase) {
    return {
      success: false,
      message: "No se encontró ninguna entrada con este código.",
    }
  }

  // Check if purchase is expired (older than 24 hours)
  const ageHours = (Date.now() - purchase.createdAt.getTime()) / (1000 * 60 * 60)
  if (ageHours > 24) {
    purchase.status = "expired"
    return {
      success: false,
      message: "Esta entrada ha expirado.",
    }
  }

  // Mark as validated
  purchase.status = "validated"
  purchase.validatedAt = new Date()
  purchase.validatedBy = validatedBy

  return {
    success: true,
    message: `Entrada validada para ${purchase.childName}`,
    purchase,
  }
}

export const getPurchaseByQRCode = (qrCode: string): PendingPurchase | undefined => {
  return pendingPurchases.find((p) => p.qrCode === qrCode)
}

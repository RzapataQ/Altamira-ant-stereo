"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { generateTimeWarningMessage, generateTimeEndedMessage, sendWhatsAppMessage } from "@/lib/whatsapp"

export function TimeTracker() {
  const { visitors, updateVisitor, endSession } = useStore()

  useEffect(() => {
    const interval = setInterval(() => {
      visitors.forEach((visitor) => {
        if (visitor.status === "active" && visitor.sessionStarted) {
          const elapsed = Math.floor((Date.now() - visitor.sessionStarted.getTime()) / 1000 / 60)
          const remaining = visitor.totalMinutes - elapsed

          if (remaining !== visitor.remainingMinutes) {
            updateVisitor(visitor.id, { remainingMinutes: Math.max(0, remaining) })
          }

          if (remaining === 5 && !visitor.whatsappSent5min) {
            console.log("[v0] Sending 5-minute warning WhatsApp for", visitor.child.name)
            const message = generateTimeWarningMessage(visitor, 5)
            sendWhatsAppMessage(message).then(() => {
              updateVisitor(visitor.id, { whatsappSent5min: true, alertActive: true })
            })
          }

          if (remaining <= 0 && visitor.status === "active") {
            console.log("[v0] Time ended for", visitor.child.name)
            const message = generateTimeEndedMessage(visitor)
            sendWhatsAppMessage(message).then(() => {
              endSession(visitor.id)
            })
          }
        }
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [visitors, updateVisitor, endSession])

  return null
}

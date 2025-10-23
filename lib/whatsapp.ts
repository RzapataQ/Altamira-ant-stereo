import type { Visitor } from "./types"

export interface WhatsAppMessage {
  to: string
  message: string
}

export function generateTimeWarningMessage(visitor: Visitor, minutesLeft: number): WhatsAppMessage {
  const message = `Hola ${visitor.guardian.name}! 

El tiempo de ${visitor.child.name} en Parke tr3s está por terminar. 

⏰ Quedan ${minutesLeft} minutos restantes.

Si deseas extender el tiempo, acércate a recepción.

¡Gracias por visitarnos!`

  return {
    to: visitor.guardian.phone,
    message,
  }
}

export function generateTimeEndedMessage(visitor: Visitor): WhatsAppMessage {
  const message = `Hola ${visitor.guardian.name}! 

El tiempo de ${visitor.child.name} en Parke tr3s ha terminado. 

Por favor, acércate a recoger a tu pequeño/a.

¡Esperamos que hayan disfrutado su visita!`

  return {
    to: visitor.guardian.phone,
    message,
  }
}

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<boolean> {
  // Mock implementation - in production, this would use Twilio, WhatsApp Business API, etc.
  console.log("[v0] WhatsApp message would be sent:", message)

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[v0] WhatsApp message sent successfully")
      resolve(true)
    }, 1000)
  })
}

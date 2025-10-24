export type VisitorStatus = "registered" | "active" | "paused" | "finished"
export type UserRole = "admin" | "worker" | "customer"
export type TimePackage = "30min" | "1hour" | "2hours" | "3hours" | "allday"

export interface Child {
  name: string
  age: number
  allergies?: string
  specialNeeds?: string
}

export interface Guardian {
  name: string
  phone: string
  email?: string
  relationship: string // "Padre", "Madre", "Abuelo/a", "Tío/a", etc.
}

export interface TimePackageOption {
  id: TimePackage
  name: string
  minutes: number
  price: number
  description: string
  popular?: boolean
}

export interface Visitor {
  id: string
  child: Child
  guardian: Guardian
  timePackage: TimePackage
  totalMinutes: number
  remainingMinutes: number
  initialMinutes: number
  registrationDate: Date
  sessionStarted?: Date
  status: VisitorStatus
  qrData: string
  paymentMethod: string // Added payment method to track how the visitor paid
  soldBy: string // Username of the worker/admin who sold the ticket
  whatsappSent5min: boolean
  speakerActivated5min: boolean
  recharges: number
  alertActive: boolean
}

export interface User {
  id: string
  username: string
  password: string // Added password field to User type
  role: UserRole
  createdAt: Date
  lastLogin?: Date
  active: boolean
}

export interface Purchase {
  id: string
  visitor: Visitor
  amount: number
  paymentMethod: string
  createdAt: Date
  status: "pending" | "completed" | "cancelled"
}

export interface WhatsAppNotification {
  id: string
  visitorId: string
  guardianPhone: string
  message: string
  sentAt: Date
  delivered: boolean
}

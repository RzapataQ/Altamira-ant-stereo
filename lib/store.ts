"use client"

import { create } from "zustand"
import type { Visitor, User, Purchase, Child, Guardian, TimePackage } from "./types"
import { MOCK_USERS, MOCK_VISITORS, MOCK_PURCHASES } from "./mock-data"

interface StoreState {
  // Current registration
  currentChild: Child | null
  currentGuardian: Guardian | null
  selectedTimePackage: TimePackage | null
  setChildInfo: (child: Child) => void
  setGuardianInfo: (guardian: Guardian) => void
  setTimePackage: (packageId: TimePackage) => void
  clearRegistration: () => void

  // Auth
  currentUser: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  changePassword: (userId: string, newPassword: string) => boolean

  // Visitors
  visitors: Visitor[]
  addVisitor: (visitor: Visitor) => void
  updateVisitor: (id: string, updates: Partial<Visitor>) => void
  getActiveVisitors: () => Visitor[]
  getVisitorById: (id: string) => Visitor | undefined

  // Purchases
  purchases: Purchase[]
  addPurchase: (purchase: Purchase) => void

  // Time tracking
  startSession: (visitorId: string) => void
  pauseSession: (visitorId: string) => void
  endSession: (visitorId: string) => void
  addTime: (visitorId: string, minutes: number) => void

  // Admin settings
  announcementMessage: string
  setAnnouncementMessage: (message: string) => void
  voiceSettings: {
    voiceName: string
    rate: number
    pitch: number
  }
  setVoiceSettings: (settings: { voiceName: string; rate: number; pitch: number }) => void
  timePackages: TimePackage[]
  addTimePackage: (pkg: TimePackage) => void
  updateTimePackage: (id: string, updates: Partial<TimePackage>) => void
  deleteTimePackage: (id: string) => void
}

export const useStore = create<StoreState>((set, get) => ({
  // Registration state
  currentChild: null,
  currentGuardian: null,
  selectedTimePackage: null,

  setChildInfo: (child) => set({ currentChild: child }),
  setGuardianInfo: (guardian) => set({ currentGuardian: guardian }),
  setTimePackage: (packageId) => set({ selectedTimePackage: packageId }),
  clearRegistration: () =>
    set({
      currentChild: null,
      currentGuardian: null,
      selectedTimePackage: null,
    }),

  // Auth state
  currentUser: null,

  login: (username, password) => {
    const user = MOCK_USERS.find((u) => u.username === username && u.password === password)
    if (user) {
      set({ currentUser: user })
      return true
    }
    return false
  },

  logout: () => set({ currentUser: null }),

  changePassword: (userId, newPassword) => {
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].password = newPassword
      const currentUser = get().currentUser
      if (currentUser && currentUser.id === userId) {
        set({ currentUser: { ...currentUser, password: newPassword } })
      }
      return true
    }
    return false
  },

  // Visitors state
  visitors: MOCK_VISITORS,

  addVisitor: (visitor) => {
    set({ visitors: [...get().visitors, visitor] })
  },

  updateVisitor: (id, updates) => {
    set({
      visitors: get().visitors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })
  },

  getActiveVisitors: () => {
    return get().visitors.filter((v) => v.status === "active" || v.status === "paused")
  },

  getVisitorById: (id) => {
    return get().visitors.find((v) => v.id === id)
  },

  // Purchases state
  purchases: MOCK_PURCHASES,

  addPurchase: (purchase) => {
    set({ purchases: [...get().purchases, purchase] })
  },

  // Time tracking
  startSession: (visitorId) => {
    get().updateVisitor(visitorId, {
      status: "active",
      sessionStarted: new Date(),
    })
  },

  pauseSession: (visitorId) => {
    get().updateVisitor(visitorId, {
      status: "paused",
    })
  },

  endSession: (visitorId) => {
    get().updateVisitor(visitorId, {
      status: "finished",
      remainingMinutes: 0,
    })
  },

  addTime: (visitorId, minutes) => {
    const visitor = get().getVisitorById(visitorId)
    if (visitor) {
      get().updateVisitor(visitorId, {
        totalMinutes: visitor.totalMinutes + minutes,
        remainingMinutes: visitor.remainingMinutes + minutes,
        recharges: visitor.recharges + 1,
      })
    }
  },

  // Admin settings
  announcementMessage:
    "{{childName}} y {{guardianName}}, les faltan 5 minutos. Si desea seguir con la diversión, acérquese al puesto de información o ingreso para recargar más tiempo en el parque.",

  setAnnouncementMessage: (message) => set({ announcementMessage: message }),

  voiceSettings: {
    voiceName: "es-ES-Standard-A", // Default Spanish voice
    rate: 0.9,
    pitch: 1.0,
  },

  setVoiceSettings: (settings) => set({ voiceSettings: settings }),

  timePackages: [
    { id: "1", name: "30 Minutos", minutes: 30, price: 15000, description: "Ideal para una visita rápida" },
    { id: "2", name: "1 Hora", minutes: 60, price: 25000, description: "Tiempo perfecto para disfrutar" },
    { id: "3", name: "2 Horas", minutes: 120, price: 40000, description: "Diversión extendida" },
    { id: "4", name: "3 Horas", minutes: 180, price: 55000, description: "Máxima diversión" },
  ],

  addTimePackage: (pkg) => {
    set({ timePackages: [...get().timePackages, pkg] })
  },

  updateTimePackage: (id, updates) => {
    set({
      timePackages: get().timePackages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })
  },

  deleteTimePackage: (id) => {
    set({
      timePackages: get().timePackages.filter((p) => p.id !== id),
    })
  },
}))

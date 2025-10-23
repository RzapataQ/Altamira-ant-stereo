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
}))

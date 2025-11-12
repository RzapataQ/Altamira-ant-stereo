"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Visitor, User, Purchase, Child, Guardian, TimePackage, Camera } from "./types"
import { MOCK_USERS, MOCK_VISITORS, MOCK_PURCHASES } from "./mock-data"

interface StoreState {
  currentChild: Child | null
  currentGuardian: Guardian | null
  selectedTimePackage: TimePackage | null
  setChildInfo: (child: Child) => void
  setGuardianInfo: (guardian: Guardian) => void
  setTimePackage: (packageId: TimePackage) => void
  clearRegistration: () => void

  currentUser: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  changePassword: (userId: string, newPassword: string) => boolean

  visitors: Visitor[]
  addVisitor: (visitor: Visitor) => void
  updateVisitor: (id: string, updates: Partial<Visitor>) => void
  getActiveVisitors: () => Visitor[]
  getVisitorById: (id: string) => Visitor | undefined

  purchases: Purchase[]
  addPurchase: (purchase: Purchase) => void

  startSession: (visitorId: string) => void
  pauseSession: (visitorId: string) => void
  endSession: (visitorId: string) => void
  addTime: (visitorId: string, minutes: number) => void

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

  cameras: Camera[]
  addCamera: (camera: Camera) => void
  updateCamera: (id: string, updates: Partial<Camera>) => void
  deleteCamera: (id: string) => void
  getAllCameras: () => Camera[]

  users: User[]
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  getAllUsers: () => User[]

  hasPermission: (action: string) => boolean
}

const SYNC_KEY = "parke-tr3s-global-sync"

const syncDataGlobally = (data: {
  users: User[]
  purchases: Purchase[]
  visitors: Visitor[]
  cameras: Camera[]
  timePackages: TimePackage[]
}) => {
  try {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(
        SYNC_KEY,
        JSON.stringify({
          ...data,
          syncedAt: new Date().toISOString(),
        }),
      )
    }
  } catch (e) {
    console.log("[v0] Global sync failed:", e)
  }
}

const loadGlobalSync = () => {
  try {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const data = localStorage.getItem(SYNC_KEY)
      return data ? JSON.parse(data) : null
    }
  } catch (e) {
    console.log("[v0] Global load failed:", e)
  }
  return null
}

const mergeUsers = (persistedUsers: User[] | undefined): User[] => {
  if (!persistedUsers || persistedUsers.length === 0) {
    return MOCK_USERS
  }

  // Always include MOCK_USERS (admin and super_admin)
  const mockUserIds = new Set(MOCK_USERS.map((u) => u.id))
  const additionalUsers = persistedUsers.filter((u) => !mockUserIds.has(u.id))

  return [...MOCK_USERS, ...additionalUsers]
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
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

      currentUser: null,

      login: (username, password) => {
        console.log("[v0] Login attempt:", username)
        console.log("[v0] Available users:", get().users)
        const user = get().users.find((u) => u.username === username && u.password === password && u.active)
        console.log("[v0] Found user:", user)
        if (user) {
          set({ currentUser: user })
          return true
        }
        return false
      },

      logout: () => set({ currentUser: null }),

      changePassword: (userId, newPassword) => {
        console.log("[v0] Changing password for user:", userId)
        const user = get().users.find((u) => u.id === userId)
        if (user) {
          const updatedUsers = get().users.map((u) =>
            u.id === userId ? { ...u, password: newPassword, updatedAt: new Date() } : u,
          )
          set({ users: updatedUsers })

          const currentUser = get().currentUser
          if (currentUser && currentUser.id === userId) {
            set({ currentUser: { ...currentUser, password: newPassword } })
          }

          syncDataGlobally({
            users: updatedUsers,
            purchases: get().purchases,
            visitors: get().visitors,
            cameras: get().cameras,
            timePackages: get().timePackages,
          })

          return true
        }
        return false
      },

      visitors: MOCK_VISITORS,

      addVisitor: (visitor) => {
        const newVisitors = [...get().visitors, visitor]
        set({ visitors: newVisitors })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: newVisitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

      updateVisitor: (id, updates) => {
        const updatedVisitors = get().visitors.map((v) => (v.id === id ? { ...v, ...updates } : v))
        set({ visitors: updatedVisitors })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: updatedVisitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

      getActiveVisitors: () => {
        return get().visitors.filter((v) => v.status === "active" || v.status === "paused")
      },

      getVisitorById: (id) => {
        return get().visitors.find((v) => v.id === id)
      },

      purchases: MOCK_PURCHASES,

      addPurchase: (purchase) => {
        const newPurchases = [...get().purchases, purchase]
        set({ purchases: newPurchases })
        syncDataGlobally({
          users: get().users,
          purchases: newPurchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

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

      announcementMessage:
        "{{childName}} y {{guardianName}}, les faltan 5 minutos. Si desea seguir con la diversión, acérquese al puesto de información o ingreso para recargar más tiempo en el parque.",

      setAnnouncementMessage: (message) => set({ announcementMessage: message }),

      voiceSettings: {
        voiceName: "es-ES-Standard-A",
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
        const newPackages = [...get().timePackages, pkg]
        set({ timePackages: newPackages })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: newPackages,
        })
      },

      updateTimePackage: (id, updates) => {
        const newPackages = get().timePackages.map((p) => (p.id === id ? { ...p, ...updates } : p))
        set({ timePackages: newPackages })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: newPackages,
        })
      },

      deleteTimePackage: (id) => {
        const newPackages = get().timePackages.filter((p) => p.id !== id)
        set({ timePackages: newPackages })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: newPackages,
        })
      },

      cameras: [],

      addCamera: (camera) => {
        const newCameras = [...get().cameras, camera]
        set({ cameras: newCameras })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: newCameras,
          timePackages: get().timePackages,
        })
      },

      updateCamera: (id, updates) => {
        const newCameras = get().cameras.map((c) => (c.id === id ? { ...c, ...updates } : c))
        set({ cameras: newCameras })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: newCameras,
          timePackages: get().timePackages,
        })
      },

      deleteCamera: (id) => {
        const newCameras = get().cameras.filter((c) => c.id !== id)
        set({ cameras: newCameras })
        syncDataGlobally({
          users: get().users,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: newCameras,
          timePackages: get().timePackages,
        })
      },

      getAllCameras: () => {
        return get().cameras
      },

      users: MOCK_USERS,

      addUser: (user) => {
        const newUsers = [...get().users, user]
        set({ users: newUsers })
        syncDataGlobally({
          users: newUsers,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

      updateUser: (id, updates) => {
        const newUsers = get().users.map((u) => (u.id === id ? { ...u, ...updates } : u))
        set({ users: newUsers })
        syncDataGlobally({
          users: newUsers,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

      deleteUser: (id) => {
        const newUsers = get().users.filter((u) => u.id !== id)
        set({ users: newUsers })
        syncDataGlobally({
          users: newUsers,
          purchases: get().purchases,
          visitors: get().visitors,
          cameras: get().cameras,
          timePackages: get().timePackages,
        })
      },

      getAllUsers: () => {
        return get().users
      },

      hasPermission: (action: string) => {
        const user = get().currentUser
        if (!user) return false

        if (user.role === "super_admin") return true

        if (user.role === "admin") {
          const adminActions = [
            "manage_workers",
            "manage_packages",
            "view_reports",
            "manage_cameras",
            "change_announcement",
          ]
          return adminActions.includes(action)
        }

        return false
      },
    }),
    {
      name: "parke-tr3s-storage",
      merge: (persistedState: any, currentState: StoreState) => {
        let globalData = null
        try {
          globalData = loadGlobalSync()
        } catch (e) {
          console.log("[v0] Could not load global sync data:", e)
        }

        return {
          ...currentState,
          ...persistedState,
          users: mergeUsers(globalData?.users || persistedState?.users),
          cameras: globalData?.cameras || persistedState?.cameras || currentState.cameras,
          timePackages: globalData?.timePackages || persistedState?.timePackages || currentState.timePackages,
          purchases: globalData?.purchases || persistedState?.purchases || currentState.purchases,
          visitors: globalData?.visitors || persistedState?.visitors || currentState.visitors,
        }
      },
      partialize: (state) => ({
        users: state.users,
        cameras: state.cameras,
        timePackages: state.timePackages,
        announcementMessage: state.announcementMessage,
        voiceSettings: state.voiceSettings,
        visitors: state.visitors,
        purchases: state.purchases,
      }),
    },
  ),
)

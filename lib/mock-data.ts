import type { TimePackageOption, User, Visitor, Purchase } from "./types"

export const TIME_PACKAGES: TimePackageOption[] = [
  {
    id: "30min",
    name: "30 Minutos",
    minutes: 30,
    price: 8000,
    description: "Perfecto para una visita rápida",
  },
  {
    id: "1hour",
    name: "1 Hora",
    minutes: 60,
    price: 15000,
    description: "Tiempo ideal para disfrutar",
    popular: true,
  },
  {
    id: "2hours",
    name: "2 Horas",
    minutes: 120,
    price: 25000,
    description: "Diversión extendida",
    popular: true,
  },
  {
    id: "3hours",
    name: "3 Horas",
    minutes: 180,
    price: 35000,
    description: "Máxima diversión",
  },
  {
    id: "allday",
    name: "Todo el Día",
    minutes: 480,
    price: 50000,
    description: "Acceso ilimitado todo el día",
  },
]

export const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    active: true,
  },
  {
    id: "2",
    username: "superadmin",
    password: "superadmin",
    role: "super_admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    active: true,
  },
]

export const MOCK_VISITORS: Visitor[] = []

export const MOCK_PURCHASES: Purchase[] = []

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
    username: "trabajador1",
    password: "trabajador123",
    role: "worker",
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date(),
    active: true,
  },
]

export const MOCK_VISITORS: Visitor[] = [
  {
    id: "1",
    child: {
      name: "Sofía Martínez",
      age: 6,
    },
    guardian: {
      name: "Ana Martínez",
      phone: "+573001234567",
      relationship: "Madre",
    },
    timePackage: "2hours",
    totalMinutes: 120,
    remainingMinutes: 45,
    initialMinutes: 120,
    registrationDate: new Date(),
    sessionStarted: new Date(Date.now() - 75 * 60 * 1000),
    status: "active",
    qrData: "PARKETR3S-001-20250110",
    whatsappSent5min: false,
    speakerActivated5min: false,
    recharges: 0,
    alertActive: false,
  },
  {
    id: "2",
    child: {
      name: "Lucas Rodríguez",
      age: 4,
      allergies: "Ninguna",
    },
    guardian: {
      name: "Carlos Rodríguez",
      phone: "+573009876543",
      relationship: "Padre",
    },
    timePackage: "1hour",
    totalMinutes: 60,
    remainingMinutes: 60,
    initialMinutes: 60,
    registrationDate: new Date(),
    status: "registered",
    qrData: "PARKETR3S-002-20250110",
    whatsappSent5min: false,
    speakerActivated5min: false,
    recharges: 0,
    alertActive: false,
  },
]

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: "1",
    visitor: MOCK_VISITORS[0],
    amount: 25000,
    paymentMethod: "Tarjeta de crédito",
    createdAt: new Date(),
    status: "completed",
  },
]

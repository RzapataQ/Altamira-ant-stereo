"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { TIME_PACKAGES } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, Clock, TrendingUp, ArrowLeft, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const currentUser = useStore((state) => state.currentUser)
  const purchases = useStore((state) => state.purchases)
  const visitors = useStore((state) => state.visitors)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login?redirect=/admin")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const totalVisitors = visitors.length
  const activeVisitors = visitors.filter((v) => v.status === "active").length
  const completedVisits = visitors.filter((v) => v.status === "finished").length

  const packagesSold = purchases.reduce(
    (acc, purchase) => {
      const pkg = TIME_PACKAGES.find((p) => p.id === purchase.visitor.timePackage)
      if (pkg) {
        if (!acc[pkg.name]) {
          acc[pkg.name] = 0
        }
        acc[pkg.name] += 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalPackagesSold = Object.values(packagesSold).reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona las ventas y visitantes de Parke tr3s</p>
          </div>
          <div className="flex gap-3">
            <Link href="/tracking">
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Control de Tiempo
              </Button>
            </Link>
            <Link href="/check-in">
              <Button variant="outline">Check-In</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {purchases.length} ventas realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors}</div>
              <p className="text-xs text-muted-foreground mt-1">{completedVisits} visitas completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Activos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeVisitors}</div>
              <p className="text-xs text-muted-foreground mt-1">En el parque ahora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue / purchases.length || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Por visita</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Paquetes Vendidos</CardTitle>
              <CardDescription>Distribución de ventas por paquete de tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(packagesSold).map(([name, count]) => {
                  const percentage = (count / totalPackagesSold) * 100
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{name}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitantes Recientes</CardTitle>
              <CardDescription>Últimos registros de entrada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((visitor) => (
                    <div key={visitor.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{visitor.child.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visitor.registrationDate).toLocaleDateString("es-CO")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{visitor.totalMinutes} min</p>
                        <Badge
                          variant={
                            visitor.status === "active"
                              ? "default"
                              : visitor.status === "finished"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs mt-1"
                        >
                          {visitor.status === "active"
                            ? "Activo"
                            : visitor.status === "finished"
                              ? "Finalizado"
                              : "Registrado"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas las Transacciones</CardTitle>
            <CardDescription>Historial completo de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium">Niño/a</th>
                    <th className="text-left py-3 px-4 font-medium">Acudiente</th>
                    <th className="text-left py-3 px-4 font-medium">Paquete</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases
                    .slice()
                    .reverse()
                    .map((purchase) => (
                      <tr key={purchase.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-mono">#{purchase.id.slice(-6)}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString("es-CO")}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{purchase.visitor.child.name}</td>
                        <td className="py-3 px-4 text-sm">{purchase.visitor.guardian.name}</td>
                        <td className="py-3 px-4 text-sm">
                          {TIME_PACKAGES.find((p) => p.id === purchase.visitor.timePackage)?.name}
                        </td>
                        <td className="py-3 px-4 font-medium">{formatPrice(purchase.amount)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                            {purchase.status === "completed" ? "Completado" : "Pendiente"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, Clock, ShoppingCart, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function WorkerPage() {
  const currentUser = useStore((state) => state.currentUser)
  const purchases = useStore((state) => state.purchases)
  const visitors = useStore((state) => state.visitors)
  const timePackages = useStore((state) => state.timePackages)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?redirect=/worker")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  // Filter data for current worker
  const myPurchases = purchases.filter((p) => p.visitor.soldBy === currentUser.username)
  const myVisitors = visitors.filter((v) => v.soldBy === currentUser.username)
  const myRevenue = myPurchases.reduce((sum, p) => sum + p.amount, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Panel de Ventas
            </h1>
            <p className="text-muted-foreground">Bienvenido, {currentUser.username}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Nueva Venta
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mis Ventas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{myPurchases.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ventas realizadas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mis Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{formatPrice(myRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Total generado
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mis Visitantes</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{myVisitors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Clientes atendidos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatPrice(myRevenue / myPurchases.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Por venta</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mis Ventas Recientes</CardTitle>
            <CardDescription>Últimas transacciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {myPurchases.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No has realizado ventas aún</p>
                <Link href="/register">
                  <Button className="mt-4 bg-gradient-to-r from-primary to-secondary">Realizar Primera Venta</Button>
                </Link>
              </div>
            ) : (
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
                    {myPurchases
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((purchase) => (
                        <tr key={purchase.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-mono">#{purchase.id.slice(-6)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(purchase.createdAt).toLocaleDateString("es-CO")}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">{purchase.visitor.child.name}</td>
                          <td className="py-3 px-4 text-sm">{purchase.visitor.guardian.name}</td>
                          <td className="py-3 px-4 text-sm">
                            {timePackages.find((p) => p.id === purchase.visitor.timePackage)?.name}
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
            )}
          </CardContent>
        </Card>

        {/* Available Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Paquetes Disponibles</CardTitle>
            <CardDescription>Opciones de tiempo para ofrecer a los clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {timePackages.map((pkg, index) => {
                const colors = ["primary", "secondary", "accent", "yellow-500"]
                const color = colors[index % colors.length]
                return (
                  <Card key={pkg.id} className={`border-l-4 border-l-${color}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold text-${color}`}>{formatPrice(pkg.price)}</div>
                      <p className="text-sm text-muted-foreground">{pkg.minutes} minutos</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

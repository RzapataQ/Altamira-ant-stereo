"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TimePackageOption } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

interface TimePackageCardProps {
  package: TimePackageOption
}

export function TimePackageCard({ package: pkg }: TimePackageCardProps) {
  const router = useRouter()
  const setTimePackage = useStore((state) => state.setTimePackage)
  const timePackages = useStore((state) => state.timePackages)

  const handleSelect = () => {
    setTimePackage(pkg.id)
    router.push("/register")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const colors = ["#9c4eb3", "#3dc9a1", "#fa804f", "#fdbf2c", "#40c0dd"]
  const colorIndex = timePackages.findIndex((p) => p.id === pkg.id) % colors.length
  const cardColor = colors[colorIndex]

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-xl hover:scale-105 ${pkg.popular ? "border-2" : "border"}`}
      style={{ borderColor: pkg.popular ? cardColor : undefined }}
    >
      {pkg.popular && (
        <Badge className="absolute top-4 right-4 text-white" style={{ background: cardColor }}>
          Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: cardColor }}>
          {pkg.name}
        </CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold" style={{ color: cardColor }}>
            {formatPrice(pkg.price)}
          </div>
          <div className="text-sm text-muted-foreground">{pkg.minutes} minutos de diversión</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSelect} className="w-full text-white hover:opacity-90" style={{ background: cardColor }}>
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  )
}

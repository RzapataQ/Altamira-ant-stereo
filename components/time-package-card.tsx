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

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${pkg.popular ? "border-primary" : ""}`}>
      {pkg.popular && <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Popular</Badge>}
      <CardHeader>
        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">{formatPrice(pkg.price)}</div>
          <div className="text-sm text-muted-foreground">{pkg.minutes} minutos de diversión</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSelect} className="w-full" variant={pkg.popular ? "default" : "outline"}>
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { TIME_PACKAGES } from "@/lib/mock-data"
import type { Child, Guardian } from "@/lib/types"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { selectedTimePackage, setChildInfo, setGuardianInfo, setTimePackage } = useStore()

  // Child form state
  const [childName, setChildName] = useState("")
  const [childAge, setChildAge] = useState("")
  const [allergies, setAllergies] = useState("")
  const [specialNeeds, setSpecialNeeds] = useState("")

  // Guardian form state
  const [guardianName, setGuardianName] = useState("")
  const [guardianPhone, setGuardianPhone] = useState("")
  const [guardianEmail, setGuardianEmail] = useState("")
  const [relationship, setRelationship] = useState("")

  // Time package state
  const [selectedPackage, setSelectedPackage] = useState(selectedTimePackage || "1hour")

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const child: Child = {
      name: childName,
      age: Number.parseInt(childAge),
      allergies: allergies || undefined,
      specialNeeds: specialNeeds || undefined,
    }
    setChildInfo(child)
    setStep(2)
  }

  const handleGuardianSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const guardian: Guardian = {
      name: guardianName,
      phone: guardianPhone,
      email: guardianEmail || undefined,
      relationship,
    }
    setGuardianInfo(guardian)
    setStep(3)
  }

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimePackage(selectedPackage)
    router.push("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              1. Información del Niño
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              2. Información del Acudiente
            </span>
            <span className={`text-sm font-medium ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              3. Seleccionar Tiempo
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Información del Niño/a</CardTitle>
              <CardDescription>Completa los datos del pequeño que visitará el parque</CardDescription>
            </CardHeader>
            <form onSubmit={handleChildSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Nombre Completo del Niño/a *</Label>
                  <Input
                    id="childName"
                    type="text"
                    placeholder="Ej: Sofía Martínez"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childAge">Edad *</Label>
                  <Input
                    id="childAge"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Ej: 6"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias (opcional)</Label>
                  <Input
                    id="allergies"
                    type="text"
                    placeholder="Ej: Ninguna, o especifica alergias"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialNeeds">Necesidades Especiales (opcional)</Label>
                  <Textarea
                    id="specialNeeds"
                    placeholder="Cualquier información adicional que debamos saber"
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Button type="submit" className="w-full" size="lg">
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Información del Acudiente</CardTitle>
              <CardDescription>Datos de contacto del padre, madre o responsable</CardDescription>
            </CardHeader>
            <form onSubmit={handleGuardianSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Nombre Completo del Acudiente *</Label>
                  <Input
                    id="guardianName"
                    type="text"
                    placeholder="Ej: Ana Martínez"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Teléfono / WhatsApp *</Label>
                  <Input
                    id="guardianPhone"
                    type="tel"
                    placeholder="Ej: +573001234567"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Recibirás notificaciones por WhatsApp cuando el tiempo esté por terminar
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianEmail">Email (opcional)</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    placeholder="tu@email.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relación con el Niño/a *</Label>
                  <Select value={relationship} onValueChange={setRelationship} required>
                    <SelectTrigger id="relationship">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Padre">Padre</SelectItem>
                      <SelectItem value="Madre">Madre</SelectItem>
                      <SelectItem value="Abuelo/a">Abuelo/a</SelectItem>
                      <SelectItem value="Tío/a">Tío/a</SelectItem>
                      <SelectItem value="Tutor/a">Tutor/a</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atrás
                </Button>
                <Button type="submit" className="flex-1">
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Selecciona el Tiempo</CardTitle>
              <CardDescription>Elige cuánto tiempo quieres que tu pequeño disfrute del parque</CardDescription>
            </CardHeader>
            <form onSubmit={handlePackageSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {TIME_PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="timePackage"
                          value={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={(e) => setSelectedPackage(e.target.value as any)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {pkg.name}
                            {pkg.popular && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{pkg.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">{formatPrice(pkg.price)}</div>
                        <div className="text-xs text-muted-foreground">{pkg.minutes} min</div>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atrás
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Ir al Pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

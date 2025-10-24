"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Clock, Play, Pause, StopCircle, Plus, ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"
import { generateTimeWarningMessage, generateTimeEndedMessage, sendWhatsAppMessage } from "@/lib/whatsapp"

export default function TrackingPage() {
  const { visitors, updateVisitor, pauseSession, startSession, endSession, addTime, announcementMessage } = useStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  const playAnnouncement = (childName: string, guardianName: string) => {
    const message = announcementMessage.replace("{{childName}}", childName).replace("{{guardianName}}", guardianName)

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
      console.log("[v0] Playing audio announcement:", message)
    } else {
      console.log("[v0] Speech synthesis not supported")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      visitors.forEach((visitor) => {
        if (visitor.status === "active" && visitor.sessionStarted) {
          const elapsed = Math.floor((Date.now() - visitor.sessionStarted.getTime()) / 1000 / 60)
          const remaining = visitor.totalMinutes - elapsed

          if (remaining !== visitor.remainingMinutes) {
            updateVisitor(visitor.id, { remainingMinutes: Math.max(0, remaining) })
          }

          if (remaining === 5 && !visitor.whatsappSent5min) {
            console.log("[v0] Sending 5-minute warning WhatsApp and playing announcement")
            const message = generateTimeWarningMessage(visitor, 5)
            sendWhatsAppMessage(message)
            playAnnouncement(visitor.child.name, visitor.guardian.name)
            updateVisitor(visitor.id, { whatsappSent5min: true, alertActive: true })
          }

          if (remaining <= 0 && visitor.status === "active") {
            console.log("[v0] Time ended, sending final WhatsApp")
            const message = generateTimeEndedMessage(visitor)
            sendWhatsAppMessage(message)
            endSession(visitor.id)
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [visitors, updateVisitor, endSession, announcementMessage])

  const activeVisitors = visitors.filter((v) => v.status === "active" || v.status === "paused")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "finished":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "paused":
        return "Pausado"
      case "finished":
        return "Finalizado"
      default:
        return "Registrado"
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleAddTime = (visitorId: string) => {
    const minutes = prompt("¿Cuántos minutos deseas agregar?", "30")
    if (minutes && !isNaN(Number.parseInt(minutes))) {
      addTime(visitorId, Number.parseInt(minutes))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Control de Tiempo</h1>
            <p className="text-muted-foreground">Monitorea el tiempo de los visitantes en tiempo real</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Visitantes activos</p>
            <p className="text-3xl font-bold text-primary">{activeVisitors.length}</p>
          </div>
        </div>

        {activeVisitors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay visitantes activos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Los visitantes aparecerán aquí cuando inicien su sesión
              </p>
              <Link href="/check-in">
                <Button>Ir a Check-In</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {activeVisitors.map((visitor) => {
              const timePercentage = (visitor.remainingMinutes / visitor.totalMinutes) * 100
              const isLowTime = visitor.remainingMinutes <= 10

              return (
                <Card key={visitor.id} className={isLowTime ? "border-orange-500 border-2" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3">
                          {visitor.child.name}
                          <Badge className={getStatusColor(visitor.status)}>{getStatusLabel(visitor.status)}</Badge>
                          {visitor.alertActive && (
                            <Badge variant="outline" className="gap-1">
                              <Bell className="h-3 w-3" />
                              Alerta
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Acudiente: {visitor.guardian.name} • {visitor.guardian.phone}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Tiempo restante</p>
                        <p className={`text-2xl font-bold ${isLowTime ? "text-orange-500" : "text-primary"}`}>
                          {formatTime(visitor.remainingMinutes)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{Math.round(timePercentage)}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            isLowTime ? "bg-orange-500" : "bg-primary"
                          }`}
                          style={{ width: `${timePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tiempo total</p>
                        <p className="font-medium">{formatTime(visitor.totalMinutes)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tiempo usado</p>
                        <p className="font-medium">{formatTime(visitor.totalMinutes - visitor.remainingMinutes)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recargas</p>
                        <p className="font-medium">{visitor.recharges}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Edad</p>
                        <p className="font-medium">{visitor.child.age} años</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {visitor.status === "active" ? (
                        <Button variant="outline" size="sm" onClick={() => pauseSession(visitor.id)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => startSession(visitor.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Reanudar
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleAddTime(visitor.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Tiempo
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("¿Estás seguro de finalizar la sesión?")) {
                            endSession(visitor.id)
                          }
                        }}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Finalizar
                      </Button>
                    </div>

                    {visitor.child.allergies && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-orange-900">Alergias: {visitor.child.allergies}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

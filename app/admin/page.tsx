"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  ArrowLeft,
  Activity,
  Volume2,
  Save,
  Plus,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminPage() {
  const currentUser = useStore((state) => state.currentUser)
  const purchases = useStore((state) => state.purchases)
  const visitors = useStore((state) => state.visitors)
  const announcementMessage = useStore((state) => state.announcementMessage)
  const setAnnouncementMessage = useStore((state) => state.setAnnouncementMessage)
  const voiceSettings = useStore((state) => state.voiceSettings)
  const setVoiceSettings = useStore((state) => state.setVoiceSettings)
  const timePackages = useStore((state) => state.timePackages)
  const addTimePackage = useStore((state) => state.addTimePackage)
  const updateTimePackage = useStore((state) => state.updateTimePackage)
  const deleteTimePackage = useStore((state) => state.deleteTimePackage)
  const users = useStore((state) => state.getAllUsers())
  const addUser = useStore((state) => state.addUser)
  const updateUser = useStore((state) => state.updateUser)
  const deleteUser = useStore((state) => state.deleteUser)
  const router = useRouter()

  const [editedMessage, setEditedMessage] = useState(announcementMessage)
  const [messageSaved, setMessageSaved] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  const [packageForm, setPackageForm] = useState({
    name: "",
    minutes: "",
    price: "",
    description: "",
  })
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<any>(null)
  const [workerForm, setWorkerForm] = useState({
    username: "",
    password: "",
    role: "worker" as "admin" | "worker",
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login?redirect=/admin")
    }
  }, [currentUser, router])

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices.filter((v) => v.lang.startsWith("es")))
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const handleSaveMessage = () => {
    setAnnouncementMessage(editedMessage)
    setMessageSaved(true)
    setTimeout(() => setMessageSaved(false), 3000)
  }

  const handleTestAnnouncement = () => {
    const testMessage = editedMessage.replace("{{childName}}", "Juan").replace("{{guardianName}}", "María")

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(testMessage)
      utterance.lang = "es-ES"
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch

      const selectedVoice = voices.find((v) => v.name === voiceSettings.voiceName)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      window.speechSynthesis.speak(utterance)
    } else {
      alert("Tu navegador no soporta síntesis de voz")
    }
  }

  const handleOpenPackageDialog = (pkg?: any) => {
    if (pkg) {
      setEditingPackage(pkg)
      setPackageForm({
        name: pkg.name,
        minutes: pkg.minutes.toString(),
        price: pkg.price.toString(),
        description: pkg.description,
      })
    } else {
      setEditingPackage(null)
      setPackageForm({ name: "", minutes: "", price: "", description: "" })
    }
    setIsPackageDialogOpen(true)
  }

  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.minutes || !packageForm.price) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const packageData = {
      id: editingPackage?.id || Date.now().toString(),
      name: packageForm.name,
      minutes: Number.parseInt(packageForm.minutes),
      price: Number.parseInt(packageForm.price),
      description: packageForm.description,
    }

    if (editingPackage) {
      updateTimePackage(editingPackage.id, packageData)
    } else {
      addTimePackage(packageData)
    }

    setIsPackageDialogOpen(false)
    setPackageForm({ name: "", minutes: "", price: "", description: "" })
  }

  const handleDeletePackage = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este paquete?")) {
      deleteTimePackage(id)
    }
  }

  const handleOpenWorkerDialog = (user?: any) => {
    if (user) {
      setEditingWorker(user)
      setWorkerForm({
        username: user.username,
        password: "",
        role: user.role,
      })
    } else {
      setEditingWorker(null)
      setWorkerForm({ username: "", password: "", role: "worker" })
    }
    setIsWorkerDialogOpen(true)
  }

  const handleSaveWorker = () => {
    if (!workerForm.username || (!editingWorker && !workerForm.password)) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    if (editingWorker) {
      // Editing existing user
      const updates: any = {
        username: workerForm.username,
        role: workerForm.role,
      }
      if (workerForm.password) {
        updates.password = workerForm.password
      }
      updateUser(editingWorker.id, updates)
    } else {
      // Creating new user
      const newUser = {
        id: Date.now().toString(),
        username: workerForm.username,
        password: workerForm.password,
        role: workerForm.role,
        createdAt: new Date(),
        active: true,
      }
      addUser(newUser)
    }

    setIsWorkerDialogOpen(false)
    setWorkerForm({ username: "", password: "", role: "worker" })
  }

  const handleToggleUserActive = (userId: string, currentActive: boolean) => {
    updateUser(userId, { active: !currentActive })
  }

  const handleDeleteWorker = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta")
      return
    }
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      deleteUser(userId)
    }
  }

  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const totalVisitors = visitors.length
  const activeVisitors = visitors.filter((v) => v.status === "active").length
  const completedVisits = visitors.filter((v) => v.status === "finished").length

  const packagesSold = purchases.reduce(
    (acc, purchase) => {
      const pkg = timePackages.find((p) => p.id === purchase.visitor.timePackage)
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 px-4">
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
            <Link href="/settings">
              <Button variant="outline">Configuración</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Configuración de Anuncios por Parlantes
            </CardTitle>
            <CardDescription>
              Personaliza el mensaje y la voz que se reproducirá cuando falten 5 minutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice">Tipo de Voz</Label>
                <Select
                  value={voiceSettings.voiceName}
                  onValueChange={(value) => setVoiceSettings({ ...voiceSettings, voiceName: value })}
                >
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Selecciona una voz" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Velocidad: {voiceSettings.rate.toFixed(1)}</Label>
                <Input
                  id="rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, rate: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pitch">Tono: {voiceSettings.pitch.toFixed(1)}</Label>
                <Input
                  id="pitch"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement">Mensaje de Anuncio</Label>
              <Textarea
                id="announcement"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={4}
                placeholder="Usa {{childName}} y {{guardianName}} para los nombres"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveMessage}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Mensaje
              </Button>
              <Button variant="outline" onClick={handleTestAnnouncement}>
                <Volume2 className="h-4 w-4 mr-2" />
                Probar Anuncio
              </Button>
            </div>
            {messageSaved && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-900">Configuración guardada exitosamente</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Paquetes de Tiempo</CardTitle>
                <CardDescription>Gestiona los paquetes disponibles para los visitantes</CardDescription>
              </div>
              <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenPackageDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paquete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingPackage ? "Editar Paquete" : "Nuevo Paquete"}</DialogTitle>
                    <DialogDescription>
                      {editingPackage ? "Modifica los detalles del paquete" : "Crea un nuevo paquete de tiempo"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pkg-name">Nombre del Paquete</Label>
                      <Input
                        id="pkg-name"
                        value={packageForm.name}
                        onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                        placeholder="Ej: 1 Hora"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkg-minutes">Minutos</Label>
                      <Input
                        id="pkg-minutes"
                        type="number"
                        value={packageForm.minutes}
                        onChange={(e) => setPackageForm({ ...packageForm, minutes: e.target.value })}
                        placeholder="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkg-price">Precio (COP)</Label>
                      <Input
                        id="pkg-price"
                        type="number"
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                        placeholder="25000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkg-description">Descripción</Label>
                      <Textarea
                        id="pkg-description"
                        value={packageForm.description}
                        onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                        placeholder="Descripción del paquete"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSavePackage}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {timePackages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-primary">{formatPrice(pkg.price)}</p>
                      <p className="text-sm text-muted-foreground">{pkg.minutes} minutos</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleOpenPackageDialog(pkg)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Gestión de Trabajadores
                </CardTitle>
                <CardDescription>Administra los usuarios que pueden vender entradas</CardDescription>
              </div>
              <Dialog open={isWorkerDialogOpen} onOpenChange={setIsWorkerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenWorkerDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Trabajador
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingWorker ? "Editar Usuario" : "Nuevo Trabajador"}</DialogTitle>
                    <DialogDescription>
                      {editingWorker
                        ? "Modifica los detalles del usuario"
                        : "Crea un nuevo trabajador para vender entradas"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="worker-username">Nombre de Usuario</Label>
                      <Input
                        id="worker-username"
                        value={workerForm.username}
                        onChange={(e) => setWorkerForm({ ...workerForm, username: e.target.value })}
                        placeholder="trabajador1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="worker-password">
                        Contraseña {editingWorker && "(dejar vacío para no cambiar)"}
                      </Label>
                      <Input
                        id="worker-password"
                        type="password"
                        value={workerForm.password}
                        onChange={(e) => setWorkerForm({ ...workerForm, password: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="worker-role">Rol</Label>
                      <Select
                        value={workerForm.role}
                        onValueChange={(value: "admin" | "worker") => setWorkerForm({ ...workerForm, role: value })}
                      >
                        <SelectTrigger id="worker-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="worker">Trabajador</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsWorkerDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveWorker}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.role === "admin" ? "Administrador" : "Trabajador"}
                      </p>
                    </div>
                    <Badge variant={user.active ? "default" : "secondary"}>{user.active ? "Activo" : "Inactivo"}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenWorkerDialog(user)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleUserActive(user.id, user.active)}
                      disabled={user.id === currentUser?.id}
                    >
                      {user.active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWorker(user.id)}
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

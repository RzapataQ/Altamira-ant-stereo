"use client"

import { Button } from "@/components/ui/button"
import { TimePackageCard } from "@/components/time-package-card"
import { TIME_PACKAGES } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { Sparkles, Clock, Shield, Heart } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #9c4eb3 0%, #3dc9a1 50%, #fa804f 100%)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Bienvenidos a Parke tr3s</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Diversión Sin Límites Para Tus Pequeños
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow">
              El parque infantil más divertido y seguro de la ciudad. Compra tu entrada online y disfruta de una
              experiencia inolvidable con códigos QR para acceso rápido.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="text-lg px-8 bg-white text-[#9c4eb3] hover:bg-white/90"
              >
                Comprar Entrada
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="text-lg px-8 border-white text-white hover:bg-white/10"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-card border-2 border-[#9c4eb3] hover:shadow-lg transition-shadow">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "#9c4eb3" }}
              >
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paquetes Flexibles</h3>
              <p className="text-muted-foreground">
                Elige el tiempo perfecto para tu visita con nuestros paquetes desde 30 minutos hasta todo el día
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border-2 border-[#3dc9a1] hover:shadow-lg transition-shadow">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "#3dc9a1" }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acceso con QR</h3>
              <p className="text-muted-foreground">
                Sistema de entrada rápido y seguro con códigos QR únicos para cada visita
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border-2 border-[#fa804f] hover:shadow-lg transition-shadow">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "#fa804f" }}
              >
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguridad Total</h3>
              <p className="text-muted-foreground">
                Registro de niños y acudientes con notificaciones de WhatsApp cuando el tiempo esté por terminar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nuestros Paquetes</h2>
            <p className="text-xl text-muted-foreground">
              Selecciona el paquete perfecto para la diversión de tus pequeños
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {TIME_PACKAGES.map((pkg) => (
              <TimePackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #fdbf2c 0%, #40c0dd 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">¿Listo Para La Diversión?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Compra tu entrada ahora y recibe tu código QR al instante. Acceso rápido y seguro garantizado.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/register")}
            className="text-lg px-12 bg-white text-[#9c4eb3] hover:bg-white/90"
          >
            Comprar Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1" style={{ color: "#9c4eb3" }}>
                Parke tr3s
              </h3>
              <p className="text-sm text-muted-foreground">Diversión segura para toda la familia</p>
            </div>
            <div className="flex gap-6">
              <Button variant="ghost" onClick={() => router.push("/check-in")}>
                Check-in
              </Button>
              <Button variant="ghost" onClick={() => router.push("/tracking")}>
                Seguimiento
              </Button>
              <Button variant="ghost" onClick={() => router.push("/admin")}>
                Admin
              </Button>
              <Button variant="ghost" onClick={() => router.push("/errors")}>
                Sistema de Errores
              </Button>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-6">
            © 2025 Parke tr3s. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

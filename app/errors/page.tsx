"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { searchErrors, type ErrorCode } from "@/lib/error-database"
import { Search, Zap } from "lucide-react"

export default function ErrorsPage() {
  const [system, setSystem] = useState<"escaleras" | "ascensores">("escaleras")
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<ErrorCode[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("searchCount")
    if (saved) setSearchCount(Number.parseInt(saved))
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsModalOpen(true)
      return
    }

    setIsSearching(true)
    setTimeout(() => {
      const found = searchErrors(searchQuery, system)
      setResults(found)
      setIsModalOpen(true)
      setIsSearching(false)

      const newCount = searchCount + 1
      setSearchCount(newCount)
      localStorage.setItem("searchCount", newCount.toString())
    }, 800)
  }

  const exampleCodes = system === "escaleras" ? ["E421", "E4A.0", "E007", "E4F1"] : ["E35", "E70", "E37", "E52"]

  const totalErrors = system === "escaleras" ? 29 : 9

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Particle background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: system === "escaleras" ? "#d4af37" : "#c0c0c0",
              animationDelay: Math.random() * 10 + "s",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-2xl font-bold text-black">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Sistema de Búsqueda de Errores
                </h1>
                <p className="text-sm text-muted-foreground tracking-wide">Escaleras y Ascensores - Sistema RZQ</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalErrors}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Errores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{searchCount}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Búsquedas</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Instructions */}
        <div className="mb-12 p-6 rounded-xl bg-card border-l-4 border-primary backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Instrucciones
          </h4>
          <p className="text-muted-foreground mb-2">
            El sistema RZQ muestra códigos de error que pueden leerse de izquierda a derecha. Busque el código en esta
            aplicación para obtener la explicación correspondiente.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Seleccione el sistema (Escaleras o Ascensores) antes de buscar el código de error.
          </p>
        </div>

        {/* System Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setSystem("escaleras")}
            variant={system === "escaleras" ? "default" : "outline"}
            size="lg"
            className={`px-8 relative overflow-hidden transition-all ${
              system === "escaleras"
                ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/30"
                : "border-primary/30 hover:border-primary/50"
            }`}
          >
            {system === "escaleras" && <span className="shimmer" />}
            Escaleras
          </Button>
          <Button
            onClick={() => setSystem("ascensores")}
            variant={system === "ascensores" ? "default" : "outline"}
            size="lg"
            className={`px-8 relative overflow-hidden transition-all ${
              system === "ascensores"
                ? "bg-secondary text-black hover:bg-secondary/90 shadow-lg shadow-secondary/30"
                : "border-secondary/30 hover:border-secondary/50"
            }`}
          >
            {system === "ascensores" && <span className="shimmer" />}
            Ascensores
          </Button>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted/20 border border-white/10 backdrop-blur-sm shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Buscar Código de Error
            </h3>

            <div className="flex gap-3 mb-4">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Ejemplo: ${exampleCodes[0]}, ${exampleCodes[1]}, etc.`}
                className="bg-input border-primary/30 focus:border-primary text-lg h-14"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                size="lg"
                className="px-8 bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/30 relative overflow-hidden"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="shimmer" />
                    <Search className="w-5 h-5 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Ingrese el código de error exacto (con o sin puntos, mayúsculas o minúsculas)
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">
                Ejemplos {system === "escaleras" ? "Escaleras" : "Ascensores"}:
              </span>
              {exampleCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setSearchQuery(code)
                    setTimeout(handleSearch, 100)
                  }}
                  className="px-3 py-1 rounded-lg bg-muted border border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all text-sm font-mono font-semibold"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8 backdrop-blur-sm bg-black/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>© Todos los derechos reservados Rubén Zapata - ® Marca Registrada y Confidencial</p>
            <p>Versión 1.0</p>
          </div>
        </div>
      </footer>

      {/* Results Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">
              {results.length > 0 ? `Resultados para: ${searchQuery}` : "Sin Resultados"}
            </DialogTitle>
          </DialogHeader>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-muted/50 border-l-4 hover:bg-muted/70 transition-all"
                  style={{ borderLeftColor: system === "escaleras" ? "#d4af37" : "#c0c0c0" }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: system === "escaleras" ? "#d4af37" : "#c0c0c0" }}
                    >
                      {result.code}
                    </span>
                    <Badge
                      className="font-semibold"
                      style={{
                        background:
                          system === "escaleras"
                            ? "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)"
                            : "linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)",
                        color: "#000",
                      }}
                    >
                      {result.detectedBy}
                    </Badge>
                  </div>
                  <p className="text-foreground mb-2">{result.explanation}</p>
                  <small className="text-muted-foreground">Detectado por: {result.detectedBy}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="text-xl font-semibold mb-2">
                {searchQuery ? `No se encontraron resultados para "${searchQuery}"` : "Ingrese un código de error"}
              </h4>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Verifique que el código de error esté escrito correctamente."
                  : "Por favor, escriba el código que desea buscar."}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

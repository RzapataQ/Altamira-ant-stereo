export interface ErrorCode {
  code: string
  explanation: string
  detectedBy: string
}

export const escalerasDatabase: ErrorCode[] = [
  { code: "E001", explanation: "Error de comunicación con el controlador principal", detectedBy: "K1" },
  { code: "E002", explanation: "Fallo en el sensor de velocidad del motor", detectedBy: "S1" },
  { code: "E003", explanation: "Problema en el sistema de frenado de emergencia", detectedBy: "K1" },
  { code: "E004", explanation: "Error en el encoder de posición", detectedBy: "S1" },
  { code: "E005", explanation: "Sobrecarga del motor principal", detectedBy: "K1" },
  { code: "E006", explanation: "Fallo en el sensor de temperatura del motor", detectedBy: "S1" },
  { code: "E007", explanation: "Error en el sistema de seguridad de pasamanos", detectedBy: "K1" },
  { code: "E008", explanation: "Problema en el detector de obstáculos", detectedBy: "S1" },
  { code: "E009", explanation: "Fallo en el sistema de iluminación de escalones", detectedBy: "K1" },
  { code: "E010", explanation: "Error en el control de velocidad variable", detectedBy: "S1" },
  { code: "E011", explanation: "Problema en el sistema de lubricación automática", detectedBy: "K1" },
  { code: "E012", explanation: "Fallo en el sensor de presencia de usuarios", detectedBy: "S1" },
  { code: "E013", explanation: "Error en el sistema de alineación de escalones", detectedBy: "K1" },
  { code: "E014", explanation: "Problema en el circuito de potencia", detectedBy: "S1" },
  { code: "E015", explanation: "Fallo en el sistema de monitorización de carga", detectedBy: "K1" },
  { code: "E016", explanation: "Error en el control de dirección reversible", detectedBy: "S1" },
  { code: "E017", explanation: "Problema en el sistema de parada suave", detectedBy: "K1" },
  { code: "E018", explanation: "Fallo en el sensor de posición de cadena", detectedBy: "S1" },
  { code: "E019", explanation: "Error en el sistema de autodiagnóstico", detectedBy: "K1" },
  { code: "E020", explanation: "Problema en el módulo de comunicación remota", detectedBy: "S1" },
  { code: "E421", explanation: "Botón de parada de emergencia superior derecho presionado", detectedBy: "K1" },
  { code: "E422", explanation: "Botón de parada de emergencia superior izquierdo presionado", detectedBy: "S1" },
  { code: "E423", explanation: "Botón de parada de emergencia inferior derecho presionado", detectedBy: "K1" },
  { code: "E424", explanation: "Botón de parada de emergencia inferior izquierdo presionado", detectedBy: "S1" },
  { code: "E4A.0", explanation: "Fallo en el sensor de velocidad del motor principal", detectedBy: "K1" },
  { code: "E4A.1", explanation: "Error en la lectura del encoder de posición", detectedBy: "S1" },
  { code: "E4A.2", explanation: "Inconsistencia en los datos de velocidad", detectedBy: "K1" },
  { code: "E4F1", explanation: "Fallo en el sistema de frenado de emergencia", detectedBy: "K1" },
  { code: "E4F2", explanation: "Error en el actuador de frenos", detectedBy: "S1" },
]

export const ascensoresDatabase: ErrorCode[] = [
  { code: "E01", explanation: "Error general del sistema de control", detectedBy: "Sistema" },
  { code: "E02", explanation: "Fallo en la comunicación con la cabina", detectedBy: "Sistema" },
  { code: "E03", explanation: "Problema en el sistema de posicionamiento", detectedBy: "Sistema" },
  { code: "E04", explanation: "Error en el control de puertas", detectedBy: "Sistema" },
  { code: "E05", explanation: "Fallo en el sistema de seguridad", detectedBy: "Sistema" },
  { code: "E35", explanation: "Fallo en el sistema de cableado de seguridad", detectedBy: "Sistema" },
  { code: "E37", explanation: "Error en las guías de la cabina", detectedBy: "Sistema" },
  { code: "E52", explanation: "Error en el sensor de posición por piso", detectedBy: "Sistema" },
  { code: "E70", explanation: "Error en el control de acceso por seguridad", detectedBy: "Sistema" },
]

export function searchErrors(query: string, system: "escaleras" | "ascensores"): ErrorCode[] {
  const database = system === "escaleras" ? escalerasDatabase : ascensoresDatabase
  const normalizedQuery = query.toUpperCase().replace(/\./g, "")

  return database.filter((error) => {
    const normalizedCode = error.code.replace(/\./g, "")
    return normalizedCode === normalizedQuery
  })
}

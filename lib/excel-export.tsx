export function generateExcelReport(data: {
  visitors: any[]
  purchases: any[]
  timePackages: any[]
}) {
  // Create CSV with UTF-8 BOM for proper Spanish character encoding
  const BOM = "\uFEFF"

  const headers = [
    "ID",
    "Fecha",
    "Niño/a",
    "Edad",
    "Acudiente",
    "Teléfono",
    "WhatsApp",
    "Paquete",
    "Tiempo (min)",
    "Total",
    "Método Pago",
    "Vendido Por",
    "Estado",
    "Hora Entrada",
    "Hora Salida",
  ]

  const rows = data.purchases.map((p) => {
    const pkg = data.timePackages.find((pkg) => pkg.id === p.visitor.timePackage)
    return [
      p.id,
      new Date(p.createdAt).toLocaleDateString("es-CO"),
      p.visitor.child.name,
      p.visitor.child.age,
      p.visitor.guardian.name,
      p.visitor.guardian.phone,
      p.visitor.guardian.whatsapp || "N/A",
      pkg?.name || "N/A",
      p.visitor.totalMinutes,
      `$${p.amount.toLocaleString("es-CO")}`,
      p.visitor.paymentMethod === "cash"
        ? "Efectivo"
        : p.visitor.paymentMethod === "card"
          ? "Tarjeta"
          : "Transferencia",
      p.visitor.soldBy || "N/A",
      p.visitor.status === "active" ? "Activo" : p.visitor.status === "finished" ? "Finalizado" : "Registrado",
      p.visitor.sessionStarted ? new Date(p.visitor.sessionStarted).toLocaleTimeString("es-CO") : "N/A",
      p.visitor.status === "finished" && p.visitor.sessionStarted
        ? new Date(new Date(p.visitor.sessionStarted).getTime() + p.visitor.totalMinutes * 60000).toLocaleTimeString(
            "es-CO",
          )
        : "N/A",
    ]
  })

  const csvContent = BOM + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `parke-tr3s-reporte-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generatePDFReport(data: {
  visitors: any[]
  purchases: any[]
  timePackages: any[]
}) {
  // Create a professional HTML report that can be printed as PDF
  const reportHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Parke tr3s</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 40px; 
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #9c4eb3;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #9c4eb3, #3dc9a1, #fa804f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .report-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .report-subtitle {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }
    .info-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #3dc9a1;
    }
    .info-section h2 {
      font-size: 18px;
      color: #333;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .info-item {
      font-size: 14px;
      color: #666;
    }
    .info-item strong {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    thead {
      background: #333;
      color: white;
    }
    th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    tbody tr:hover {
      background: #f8f9fa;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Parke tr3s</div>
      <div class="report-subtitle">Sistema de Gestión de Visitantes</div>
    </div>
    <div style="text-align: right;">
      <div class="report-title">REPORTE COMPLETO</div>
      <div class="report-subtitle">Fecha: ${new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</div>
    </div>
  </div>

  <div class="info-section">
    <h2>Información del Reporte</h2>
    <div class="info-grid">
      <div class="info-item"><strong>Total de elementos:</strong> ${data.purchases.length}</div>
      <div class="info-item"><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString("es-CO")}</div>
      <div class="info-item"><strong>Visitantes activos:</strong> ${data.visitors.filter((v) => v.status === "active").length}</div>
      <div class="info-item"><strong>Ingresos totales:</strong> $${data.purchases.reduce((sum, p) => sum + p.amount, 0).toLocaleString("es-CO")}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Niño/a</th>
        <th>Edad</th>
        <th>Acudiente</th>
        <th>Teléfono</th>
        <th>Paquete</th>
        <th>Tiempo</th>
        <th>Total</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${data.purchases
        .map((p) => {
          const pkg = data.timePackages.find((pkg) => pkg.id === p.visitor.timePackage)
          return `
          <tr>
            <td>${p.id.slice(-6)}</td>
            <td>${new Date(p.createdAt).toLocaleDateString("es-CO")}</td>
            <td>${p.visitor.child.name}</td>
            <td>${p.visitor.child.age}</td>
            <td>${p.visitor.guardian.name}</td>
            <td>${p.visitor.guardian.phone}</td>
            <td>${pkg?.name || "N/A"}</td>
            <td>${p.visitor.totalMinutes} min</td>
            <td>$${p.amount.toLocaleString("es-CO")}</td>
            <td>${p.visitor.status === "active" ? "Activo" : p.visitor.status === "finished" ? "Finalizado" : "Registrado"}</td>
          </tr>
        `
        })
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <div>Generado por: Sistema Parke tr3s</div>
    <div>Reporte Completo de Visitantes</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(reportHTML)
    printWindow.document.close()
  }
}

export async function generatePDFReport(data: {
  visitors: any[]
  purchases: any[]
  timePackages: any[]
  dateRange?: { start: Date; end: Date }
}) {
  const { visitors, purchases, timePackages, dateRange } = data

  // Create PDF content
  const reportDate = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { margin: 2cm; }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 10pt;
          color: #000;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #9c4eb3;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24pt;
          font-weight: bold;
          background: linear-gradient(135deg, #9c4eb3, #3dc9a1, #fa804f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .title {
          font-size: 18pt;
          font-weight: bold;
          color: #333;
        }
        .subtitle {
          font-size: 12pt;
          color: #666;
        }
        .info-section {
          background: #f5f5f5;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #3dc9a1;
        }
        .info-section h3 {
          margin: 0 0 10px 0;
          font-size: 12pt;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background: #333;
          color: white;
          padding: 10px;
          text-align: left;
          font-size: 9pt;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #ddd;
          font-size: 9pt;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
          color: #666;
        }
        .summary-box {
          display: inline-block;
          padding: 10px 20px;
          margin: 10px;
          background: linear-gradient(135deg, #9c4eb3, #3dc9a1);
          color: white;
          border-radius: 5px;
        }
        .summary-box .label {
          font-size: 9pt;
          opacity: 0.9;
        }
        .summary-box .value {
          font-size: 16pt;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">PARKE TR3S</div>
        </div>
        <div style="text-align: right;">
          <div class="title">REPORTE DE VENTAS COMPLETO</div>
          <div class="subtitle">Fecha: ${reportDate}</div>
        </div>
      </div>

      <div class="info-section">
        <h3>INFORMACIÓN DEL REPORTE</h3>
        <p>Total de visitantes: ${visitors.length}</p>
        <p>Total de ventas: ${purchases.length}</p>
        <p>Fecha de generación: ${reportDate}</p>
        ${dateRange ? `<p>Período: ${dateRange.start.toLocaleDateString("es-CO")} - ${dateRange.end.toLocaleDateString("es-CO")}</p>` : ""}
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <div class="summary-box">
          <div class="label">Ingresos Totales</div>
          <div class="value">$${purchases.reduce((sum, p) => sum + p.amount, 0).toLocaleString("es-CO")}</div>
        </div>
        <div class="summary-box">
          <div class="label">Visitantes Activos</div>
          <div class="value">${visitors.filter((v) => v.status === "active").length}</div>
        </div>
        <div class="summary-box">
          <div class="label">Visitas Completadas</div>
          <div class="value">${visitors.filter((v) => v.status === "finished").length}</div>
        </div>
      </div>

      <h3 style="margin-top: 30px; color: #333;">DETALLE DE TRANSACCIONES</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Niño/a</th>
            <th>Acudiente</th>
            <th>Teléfono</th>
            <th>Paquete</th>
            <th>Tiempo</th>
            <th>Total</th>
            <th>Método Pago</th>
            <th>Vendido Por</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${purchases
            .map(
              (p) => `
            <tr>
              <td>#${p.id.slice(-6)}</td>
              <td>${new Date(p.createdAt).toLocaleDateString("es-CO")}</td>
              <td>${p.visitor.child.name}</td>
              <td>${p.visitor.guardian.name}</td>
              <td>${p.visitor.guardian.phone}</td>
              <td>${timePackages.find((pkg) => pkg.id === p.visitor.timePackage)?.name || "N/A"}</td>
              <td>${p.visitor.totalMinutes} min</td>
              <td>$${p.amount.toLocaleString("es-CO")}</td>
              <td>${p.visitor.paymentMethod}</td>
              <td>${p.visitor.soldBy || "N/A"}</td>
              <td>${p.status === "completed" ? "Completado" : "Pendiente"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <div>Generado por: Sistema Parke tr3s</div>
        <div>Reporte de Ventas Completo</div>
      </div>
    </body>
    </html>
  `

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `parke-tr3s-reporte-${reportDate.replace(/\//g, "-")}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // Note: For true PDF generation, you would need a library like jsPDF or pdfmake
  // This creates an HTML file that can be printed to PDF
  alert('Reporte HTML generado. Usa "Imprimir" (Ctrl+P) y selecciona "Guardar como PDF" para crear el PDF.')
}

export function generateExcelReport(data: {
  visitors: any[]
  purchases: any[]
  timePackages: any[]
}) {
  const { visitors, purchases, timePackages } = data

  // Create CSV content (Excel can open CSV files)
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

  const rows = purchases.map((p) => [
    p.id,
    new Date(p.createdAt).toLocaleDateString("es-CO"),
    p.visitor.child.name,
    p.visitor.child.age,
    p.visitor.guardian.name,
    p.visitor.guardian.phone,
    p.visitor.guardian.whatsapp,
    timePackages.find((pkg) => pkg.id === p.visitor.timePackage)?.name || "N/A",
    p.visitor.totalMinutes,
    p.amount,
    p.visitor.paymentMethod,
    p.visitor.soldBy || "N/A",
    p.status === "completed" ? "Completado" : "Pendiente",
    p.visitor.entryTime ? new Date(p.visitor.entryTime).toLocaleTimeString("es-CO") : "N/A",
    p.visitor.exitTime ? new Date(p.visitor.exitTime).toLocaleTimeString("es-CO") : "N/A",
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  // Add BOM for Excel to recognize UTF-8
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `parke-tr3s-reporte-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

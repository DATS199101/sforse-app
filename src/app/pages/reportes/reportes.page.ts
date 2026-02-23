
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: false
})
export class ReportesPage {
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private auth: AuthService) {}

  generarExcel() {
    if (!this.validarFechas()) return;

    this.auth.obtenerSancionesPorFecha(this.fechaInicio, this.fechaFin).subscribe((res: any) => {
      if (Array.isArray(res) && res.length > 0) {
        const ws = XLSX.utils.json_to_sheet(res);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sanciones');
        XLSX.writeFile(wb, `Reporte_ESFORSE_${this.fechaInicio}.xlsx`);
      } else {
        alert("No hay datos para exportar a Excel");
      }
    });
  }

  generarPDF() {
    if (!this.validarFechas()) return;

    this.auth.obtenerSancionesPorFecha(this.fechaInicio, this.fechaFin).subscribe({
      next: (res: any) => {
        if (!Array.isArray(res)) {
          console.error("El servidor no devolvió una lista válida:", res);
          return;
        }

        if (res.length === 0) {
          alert("No hay datos para estas fechas");
          return;
        }

        const doc = new jsPDF();
        
        // Encabezado institucional
        doc.setFontSize(16);
        doc.text('ESCUELA DE FORMACIÓN DE SOLDADOS "VENCEDORES DEL CENEPA"', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('PARTE DISCIPLINARIO MENSUAL', 105, 22, { align: 'center' });
        
        autoTable(doc, {
          startY: 30,
          head: [['Fecha', 'Aspirante', 'Falta', 'Detalle/Observación', 'Instructor']],
          // Fragmento de tu generarPDF() en reportes.page.ts
                body: res.map((s: any) => [
                  s.FECHA, 
                  s.ASPIRANTE, 
                  s.FALTA_COMETIDA, 
                  s.OBSERVACION || 'N/A', // Mapea s.observacion_adicional AS OBSERVACION
                   s.INSTRUCTOR_QUE_SANCIONA
                     ]),
          headStyles: { fillColor: [45, 87, 44] }, // Verde militar
          styles: { fontSize: 9 }
        });

        doc.save(`Parte_Militar_${this.fechaInicio}_al_${this.fechaFin}.pdf`);
      },
      error: (err) => {
        console.error("Error en la suscripción:", err);
        alert("Error al conectar con el servidor");
      }
    });
  }

  private validarFechas(): boolean {
    if (!this.fechaInicio || !this.fechaFin) {
      alert("Por favor, seleccione ambas fechas");
      return false;
    }
    return true;
  }
}
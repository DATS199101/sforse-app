import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})
export class HistorialPage implements OnInit {

  soldado: any = null;
  historial: any[] = [];
  cargando: boolean = true; // Para mostrar un spinner mientras carga

  constructor(
    private router: Router,
    private auth: AuthService
  ) { 
    // Recibir datos del soldado
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.soldado = this.router.getCurrentNavigation()?.extras.state?.['soldado'];
    }
  }

  ngOnInit() {
    if (this.soldado) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    // Usamos el detector de ID (igual que en sanciones)
    const idSoldado = this.soldado.id_aspirante || this.soldado.id;

    this.auth.obtenerHistorial(idSoldado).subscribe({
      next: (resp: any) => {
        this.cargando = false;
        if (resp.success) {
          this.historial = resp.historial;
        }
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      }
    });
  }
}
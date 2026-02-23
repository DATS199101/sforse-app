
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aspirantes',
  templateUrl: './aspirantes.page.html',
  styleUrls: ['./aspirantes.page.scss'],
  standalone: false
})
export class AspirantesPage implements OnInit {

  listaAspirantes: any[] = [];
  cargando: boolean = true; // Para mostrar un circulo de carga al inicio

  constructor(private authService: AuthService) { }

  // Esto se ejecuta apenas abres la pantalla
  ngOnInit() {
    this.cargarListaPersonal();
  }

  cargarListaPersonal() {
    this.authService.obtenerAspirantes().subscribe({
      next: (resp: any) => {
        this.cargando = false; // Apagamos el circulo de carga
        console.log("Lista recibida:", resp);

        // Si la BD responde success y trae la "data", la guardamos
        if (resp && resp.success) {
          this.listaAspirantes = resp.data;
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error("Error al cargar la lista de personal", err);
      }
    });
  }
}
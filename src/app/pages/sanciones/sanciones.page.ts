import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-sanciones',
  templateUrl: './sanciones.page.html',
  styleUrls: ['./sanciones.page.scss'],
  standalone: false
})
export class SancionesPage implements OnInit {

  listaFaltas: any[] = []; // Asegúrate de que el nombre sea igual al del *ngFor del HTML
rolUsuario: string = '';
faltaSeleccionada: any = null;

ionViewWillEnter() {
    // 1. Cargar el rol para el "Modo Lector"
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.rolUsuario = usuario.rol ? usuario.rol.toLowerCase().trim() : 'aspirante';

    // 2. Cargar las faltas usando tu función existente
    this.cargarCatalogo();
}

cargarCatalogo() {
    this.auth.obtenerFaltas().subscribe({
        next: (res: any) => {
            console.log("Faltas recibidas:", res);
            this.listaFaltas = res; // Esto llena el ion-select del HTML
        },
        error: (err) => {
            console.error("Error al conectar con listar_faltas.php", err);
        }
    });
}

  soldado: any = null;
  listarFaltas: any[] = [];
  
  //faltaSeleccionada: any = null;
  observacion: string = '';
  

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController 
  ) { 
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.soldado = this.router.getCurrentNavigation()?.extras.state?.['soldado'];
      console.log("Datos recibidos del soldado:", this.soldado);
    }
  }

  ngOnInit() {
    this.cargarCatalogoFaltas();
  }

 cargarCatalogoFaltas() {
    this.auth.obtenerFaltas().subscribe({
      next: (resp: any) => {
        console.log("Faltas recibidas del PHP:", resp); // Para ver si llegan bien
        if (resp.success) {
          // AQUÍ ESTÁ LA CLAVE: Recibimos resp.data
          this.listaFaltas = resp.data; 
        }
      },
      error: (err) => {
        console.log("Error al cargar faltas:", err);
      }
    });
  }

  // --- FUNCIÓN CORREGIDA Y ROBUSTA ---
  async guardarSancion() {
    // 1. Validar que se seleccionó falta
    if (!this.faltaSeleccionada) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor selecciona una falta de la lista.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // 2. DETECTOR DE ID (LA SOLUCIÓN CLAVE) 🔑
    // Buscamos el ID. Si no está en 'id_aspirante', buscamos en 'id'.
    // Esto evita el error "Faltan datos".
    const idSoldadoReal = this.soldado.id_aspirante || this.soldado.id;

    if (!idSoldadoReal) {
      alert("ERROR: No se encuentra el ID del soldado.\nDatos que tengo: " + JSON.stringify(this.soldado));
      return;
    }

    // 3. Preparar datos
    // Asegúrate de que el usuario '1' exista en tu tabla 'usuarios', o pon uno que exista.
    const idInstructor = localStorage.getItem('usuario_id') || '1'; 

    const datosSancion = {
      id_aspirante: idSoldadoReal, // Usamos el ID detectado
      id_falta: this.faltaSeleccionada.id_falta,
      id_instructor: idInstructor,
      observacion: this.observacion
    };

    console.log("Enviando al PHP:", datosSancion);

    // 4. Enviar
    this.auth.registrarSancion(datosSancion).subscribe({
      next: async (resp: any) => {
        if (resp.success) {
          const alert = await this.alertController.create({
            header: '¡Sanción Registrada!',
            message: 'Se ha guardado correctamente en la base de datos.',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/principal']);
              }
            }]
          });
          await alert.present();
        } else {
          alert("Error del servidor: " + resp.message);
        }
      },
      error: (err) => {
        console.log(err);
        alert("Error de conexión con guardar_sancion.php");
      }
    });
  }


}
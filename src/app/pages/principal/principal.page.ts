import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})
export class PrincipalPage {

  // Propiedades con tipado claro
  usuarioNombre: string = 'Usuario';
  rolUsuario: string = ''; 
  escanearActivo: boolean = false; 

  constructor(
    private auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private navCtrl: NavController // Usamos NavController para navegación nativa más fluida
  ) { }

  /**
   * Ciclo de vida de Ionic: Se ejecuta cada vez que la vista entra.
   * Ideal para verificar cambios de rol sin reiniciar la app.
   */
  ionViewWillEnter() {
    this.cargarDatosSesion();
  }

  /**
   * Centraliza la carga de datos del LocalStorage
   */
  private cargarDatosSesion() {
    const usuarioJson = localStorage.getItem('usuario');
    
    if (usuarioJson) {
      try {
        const usuarioObj = JSON.parse(usuarioJson);
        this.usuarioNombre = usuarioObj.nombres || 'Usuario';
        
        // Normalización profesional de Roles
        const rolRaw = usuarioObj.rol ? usuarioObj.rol.toLowerCase().trim() : '';
        
        // Lógica de asignación robusta
        if (rolRaw.includes('admin')) {
          this.rolUsuario = 'admin';
        } else if (rolRaw.includes('instruc')) {
          this.rolUsuario = 'instructor';
        } else {
          this.rolUsuario = 'aspirante';
        }

        if (usuarioObj.id_usuario) {
          localStorage.setItem('usuario_id', usuarioObj.id_usuario);
        }
        
        console.log(`Logueado como: ${this.usuarioNombre} | Rol: ${this.rolUsuario}`);
      } catch (error) {
        console.error("Error al procesar sesión:", error);
        this.salir();
      }
    } else {
      this.salir();
    }
  }

  // --- GESTIÓN DE REPORTES ---

  async generarReportePDF() {
    await this.mostrarNotificacion('Preparando Parte Militar en PDF...', 'danger');
    // Integración futura de jsPDF
  }

  async exportarExcel() {
    await this.mostrarNotificacion('Exportando base de datos a Excel...', 'success');
    // Integración futura de XLSX
  }

  // --- SISTEMA DE ESCÁNEO QR ---

  async escanearQr() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    
    if (status.granted) {
      this.escanearActivo = true;
      BarcodeScanner.hideBackground(); 
      document.body.style.background = 'transparent'; 
      
      const result = await BarcodeScanner.startScan(); 
      
      if (result.hasContent) {
        this.detenerEscaner(); 
        this.buscarDatosSoldado(result.content);
      }
    } else {
      this.mostrarNotificacion('Permiso de cámara denegado', 'warning');
    }
  }

  detenerEscaner() {
    this.escanearActivo = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.body.style.background = ''; 
  }

  // --- LÓGICA DE NEGOCIO ---

  buscarDatosSoldado(cedula: string) {
    this.auth.buscarAspirante(cedula).subscribe({
      next: async (resp: any) => {
        if (resp.success && resp.data) {
          this.lanzarAlertaAspirante(resp.data);
        } else {
          this.mostrarAlertaSimple('No encontrado', 'El número de cédula no consta en la base de datos.');
        }
      },
      error: () => this.mostrarNotificacion('Error de conexión con el servidor', 'danger')
    });
  }

  private async lanzarAlertaAspirante(soldado: any) {
    const alert = await this.alertController.create({
      header: '¡ASPIRANTE ENCONTRADO!',
      subHeader: `${soldado.nombres} ${soldado.apellidos || ''}`,
      message: `Año: ${soldado.anio_militar}\nCompañía: ${soldado.compania}`,
      cssClass: 'aspirante-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'btn-cancelar' },
        {
          text: 'Ver Historial',
          handler: () => this.navegarA('/historial', soldado)
        },
        {
          text: ' Sancionar',
          handler: () => this.navegarA('/sanciones', soldado)
        }
      ]
    });
    await alert.present();
  }

  // --- NAVEGACIÓN Y UTILIDADES ---

  private navegarA(ruta: string, data: any) {
    const extras: NavigationExtras = { state: { soldado: data } };
    this.router.navigate([ruta], extras);
  }

  verMiHistorial() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.navegarA('/historial', usuario);
  }

  salir() {
    localStorage.clear();
    sessionStorage.clear();
    this.navCtrl.navigateRoot('/home', { animated: true, animationDirection: 'back' });
  }

  private async mostrarNotificacion(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'middle'
    });
    await toast.present();
  }

  private async mostrarAlertaSimple(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  simularEscaneo() {
    this.buscarDatosSoldado('17001');
  }
}
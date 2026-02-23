import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  credenciales = {
    cedula: '',
    password: ''
  };

  // Variables para la visibilidad de la contraseña
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';

  constructor(
    private auth: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  // Función para alternar la visibilidad de la contraseña
  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-off-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-outline';
    }
  }

  async ingresar() {
    // 1. Validación básica de campos vacíos
    if (!this.credenciales.cedula.trim() || !this.credenciales.password.trim()) {
      this.mostrarToast('Por favor, ingrese su cédula y contraseña.', 'warning');
      return;
    }

    // 2. Mostrar indicador de carga
    const loading = await this.loadingController.create({
      message: 'Autenticando...',
      spinner: 'crescent',
      translucent: true,
      cssClass: 'custom-loading'
    });
    await loading.present();

    // 3. Llamada al servicio de autenticación
    this.auth.login(this.credenciales.cedula, this.credenciales.password).subscribe({
      next: async (res: any) => {
        await loading.dismiss();

        if (res.success) {
          // Login exitoso
          this.mostrarToast(`¡Bienvenido, ${res.usuario.nombres || 'Usuario'}!`, 'success');

          // Guardar sesión del usuario de forma segura
          localStorage.setItem('usuario', JSON.stringify(res.usuario));

          // Navegar al panel principal y reemplazar la ruta actual para no volver atrás con el botón 'atrás'
          this.router.navigate(['/principal'], { replaceUrl: true });

          // Limpiar formulario (opcional, ya que se navega a otra página)
          this.credenciales = { cedula: '', password: '' };

        } else {
          // Login fallido (credenciales incorrectas, usuario inactivo, etc.)
          this.mostrarAlerta('Acceso Denegado', res.message || 'Credenciales incorrectas. Intente nuevamente.');
        }
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error en login:', err);
        this.mostrarAlerta('Error de Conexión', 'No se pudo contactar con el servidor. Verifique su conexión a internet e intente más tarde.');
      }
    });

    
  }

  // Función auxiliar para mostrar alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{ text: 'Aceptar', role: 'cancel', cssClass: 'secondary' }],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  // Función auxiliar para mostrar toasts (mensajes emergentes)
  async mostrarToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color,
      cssClass: 'custom-toast',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          handler: () => { console.log('Toast cerrado'); }
        }
      ]
    });
    await toast.present();
  }
}
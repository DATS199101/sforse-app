import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-mantenimiento-faltas',
  templateUrl: './mantenimiento-faltas.page.html',
  styleUrls: ['./mantenimiento-faltas.page.scss'],
  standalone: false
})
export class MantenimientoFaltasPage implements OnInit {

  listaFaltas: any[] = [];

  constructor(
    private auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarFaltas();
  }

  // --- 1. LEER (READ) ---
  cargarFaltas() {
    this.auth.obtenerFaltas().subscribe({
      next: (res: any) => {
        this.listaFaltas = res;
      },
      error: (err) => {
        this.notificar('Error al conectar con el servidor', 'danger');
      }
    });
  }

  // --- 2. CREAR (CREATE) ---
  async abrirModalNueva() {
    const alert = await this.alertController.create({
      header: 'NUEVA FALTA',
      cssClass: 'alert-militar',
      inputs: [
        { name: 'descripcion', type: 'textarea', placeholder: 'Descripción de la falta...' },
        { name: 'tipo_falta', type: 'text', placeholder: 'Tipo (Leve, Grave, Muy Grave)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.descripcion && data.tipo_falta) {
              this.guardarFalta(data);
            } else {
              this.notificar('Complete todos los campos', 'warning');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  guardarFalta(datos: any) {
    this.auth.nuevaFalta(datos).subscribe(() => {
      this.notificar('Falta agregada con éxito', 'success');
      this.cargarFaltas();
    });
  }

  // --- 3. ACTUALIZAR (UPDATE) ---
  async abrirModalEditar(falta: any) {
    const alert = await this.alertController.create({
      header: 'EDITAR FALTA',
      cssClass: 'alert-militar',
      inputs: [
        { name: 'descripcion', type: 'textarea', value: falta.descripcion, placeholder: 'Descripción...' },
        { name: 'tipo_falta', type: 'text', value: falta.tipo_falta, placeholder: 'Tipo...' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Actualizar',
          handler: (data) => {
            const datosActualizados = { ...data, id_falta: falta.id_falta };
            this.actualizarFalta(datosActualizados);
          }
        }
      ]
    });
    await alert.present();
  }

  actualizarFalta(datos: any) {
    this.auth.editarFalta(datos).subscribe(() => {
      this.notificar('Registro actualizado', 'primary');
      this.cargarFaltas();
    });
  }

  // --- 4. BORRAR (DELETE) ---
  async confirmarEliminar(falta: any) {
    const alert = await this.alertController.create({
      header: '¿ELIMINAR REGISTRO?',
      message: `¿Está seguro de borrar: "${falta.descripcion}"?`,
      cssClass: 'alert-militar',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, Eliminar',
          handler: () => {
            this.auth.eliminarFalta(falta.id_falta).subscribe(() => {
              this.notificar('Falta eliminada', 'dark');
              this.cargarFaltas();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // --- UTILIDADES ---
  getFaltaColor(tipo: string) {
    if (!tipo) return 'medium';
    const t = tipo.toLowerCase();
    if (t.includes('muy grave')) return 'danger';
    if (t.includes('grave')) return 'warning';
    return 'success';
  }

  async notificar(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/api-esforse'; 

  constructor(private http: HttpClient) { }

  login(cedula: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { cedula, password });
  }

  obtenerAspirantes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar_aspirantes.php`);
  }

  // --- AGREGA ESTA NUEVA FUNCIÓN ---
  buscarAspirante(cedula: string): Observable<any> {
    // Llama al archivo PHP que creamos antes
    return this.http.get(`${this.apiUrl}/buscar_aspirante.php?cedula=${cedula}`);
  }
  obtenerFaltas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar_faltas.php`);
  }
  registrarSancion(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar_sancion.php`, datos);
  }
  obtenerHistorial(idAspirante: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/ver_historial.php?id_aspirante=${idAspirante}`);
  }
  // Añadir al auth.service.ts
nuevaFalta(datos: any) {
  return this.http.post(`${this.apiUrl}/gestion_catalogo.php`, datos);
}

editarFalta(datos: any) {
  return this.http.put(`${this.apiUrl}/gestion_catalogo.php`, datos);
}
eliminarFalta(id: number) {
  return this.http.delete(`${this.apiUrl}/gestion_catalogo.php?id=${id}`);
}
guardarSancion(datos: any): Observable<any> {
  // Asegúrate de que la URL apunte a tu nuevo archivo guardar_sancion.php
  return this.http.post(`${this.apiUrl}/guardar_sancion.php`, datos);
}
obtenerSancionesPorFecha(inicio: string, fin: string): Observable<any> {
  // Conecta con el PHP enviando los parámetros de fecha para el filtro
  return this.http.get(`${this.apiUrl}/obtener_sanciones_fecha.php?inicio=${inicio}&fin=${fin}`);
}

}
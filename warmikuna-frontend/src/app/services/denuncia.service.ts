import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private baseUrl = 'http://localhost:3000/api/denuncias';

  constructor(private http: HttpClient) {}

  crearDenuncia(data: any, token: string) {
    return this.http.post(`${this.baseUrl}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  crearConArchivo(data: FormData, token: string) {
    return this.http.post(`${this.baseUrl}/con-evidencia`, data, {
      headers: {
        Authorization: `Bearer ${token}`
        // ⚠️ No añadir 'Content-Type', Angular lo setea automáticamente para FormData
      }
    });
  }

  obtenerMisDenuncias(token: string) {
    return this.http.get(`${this.baseUrl}/mis-denuncias`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

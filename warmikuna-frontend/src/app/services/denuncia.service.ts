// File: src/app/services/denuncia.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Denuncia {
  id: number;
  descripcion: string;
  anonima: boolean;
  estado: 'pendiente' | 'en revisión' | 'cerrada';
  creada_en: string;
  evidenciaArchivo: string | null;
  correo_usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  // Apunta a tu backend
  private base = 'http://localhost:3000/api/denuncias';

  constructor(private http: HttpClient) {}

  /** Construye headers con JWT */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /** Crea una nueva denuncia (usuario) */
  crear(descripcion: string, anonima: boolean): Observable<Denuncia> {
    return this.http.post<Denuncia>(
      this.base,
      { descripcion, anonima },
      { headers: this.getHeaders() }
    );
  }

  /** Obtiene las denuncias del usuario autenticado */
  obtenerPorCorreo(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(
      this.base,
      { headers: this.getHeaders() }
    );
  }

  /** Obtiene **todas** las denuncias (solo admin) */
  obtenerTodas(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(
      `${this.base}/todas`,
      { headers: this.getHeaders() }
    );
  }

  /** Actualiza el estado de una denuncia (solo admin) */
  actualizarEstado(id: number, estado: Denuncia['estado']): Observable<Denuncia> {
    return this.http.patch<Denuncia>(
      `${this.base}/${id}`,
      { estado },
      { headers: this.getHeaders() }
    );
  }
}






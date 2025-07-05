// warmikuna-frontend/src/app/services/denuncia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Denuncia {
  id: number;
  descripcion: string;
  anonima: boolean;
  estado: string;
  creada_en: string;
  evidenciaArchivo: string | null;
  correo_usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  // Apunta directo a tu backend
  private base = 'http://localhost:3000/api/denuncias';

  constructor(private http: HttpClient) {}

  /** Crea una nueva denuncia, enviando el JWT en el header */
  crear(descripcion: string, anonima: boolean): Observable<Denuncia> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Denuncia>(
      this.base,
      { descripcion, anonima },
      { headers }
    );
  }

  /** Obtiene las denuncias del usuario autenticado */
  obtenerPorCorreo(): Observable<Denuncia[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Denuncia[]>(
      this.base,
      { headers }
    );
  }
}





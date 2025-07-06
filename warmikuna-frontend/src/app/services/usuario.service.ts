import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private base = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  /** Construye headers con JWT */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /** Trae todos los usuarios (solo admin) */
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      this.base,
      { headers: this.getHeaders() }
    );
  }

  /** Elimina un usuario por id (solo admin) */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}


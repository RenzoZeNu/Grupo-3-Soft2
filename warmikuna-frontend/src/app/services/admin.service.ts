import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';

export interface Denuncia {
  id: number;
  descripcion: string;
  anonima: boolean;
  estado: string;
  creada_en: string;
  correo_usuario: string;
}

export interface Usuario {
  id: number;
  correo: string;
  rol: 'user' | 'admin';
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  listarDenuncias(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.base}/denuncias`);
  }

  cambiarEstado(id: number, estado: string): Observable<Denuncia> {
    return this.http.put<Denuncia>(
      `${this.base}/denuncias/${id}/estado`,
      { estado }
    );
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/usuarios`);
  }

  actualizarRol(id: number, rol: 'user' | 'admin'): Observable<Usuario> {
    return this.http.patch<Usuario>(
      `${this.base}/usuarios/${id}/rol`,
      { rol }
    );
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/usuarios/${id}`);
  }
}

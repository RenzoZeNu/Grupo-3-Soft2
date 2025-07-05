import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://localhost:3000/api/admin';
  constructor(private http: HttpClient) {}

  listarDenuncias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/denuncias`);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.base}/denuncias/${id}`, { estado });
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/usuarios`);
  }

  actualizarRol(id: number, rol: string): Observable<any> {
    return this.http.patch<any>(`${this.base}/usuarios/${id}`, { rol });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/usuarios/${id}`);
  }
}


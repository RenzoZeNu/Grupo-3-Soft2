import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';

export interface LoginResponse {
  token: string;
  usuario: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apunta directamente a tu backend en el puerto 3000
  private base = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.base}/login`,
      { correo, contrasena }
    );
  }

  registrar(
    nombre: string,
    correo: string,
    contrasena: string,
    dni: string
  ): Observable<any> {
    return this.http.post(
      `${this.base}/registrar`,
      { nombre, correo, contrasena, dni }
    );
  }

  recuperar(
    correo: string,
    dni: string,
    nuevaContrasena: string
  ): Observable<any> {
    return this.http.post(
      `${this.base}/recuperar`,
      { correo, dni, nuevaContrasena }
    );
  }
}



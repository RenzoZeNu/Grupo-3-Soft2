// warmikuna-frontend/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { tap }          from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  usuario: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL apuntando a tu API de usuarios
  private base = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  /** POST /api/usuarios/login */
  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.base}/login`,
        { correo, password: contrasena }
      )
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  /** POST /api/usuarios/registrar */
  registrar(
    nombre: string,
    correo: string,
    contrasena: string,
    dni: string
  ): Observable<any> {
    // El backend espera { nombre, correo, password, dni }
    return this.http.post(
      `${this.base}/registrar`,
      {
        nombre,
        correo,
        password: contrasena,
        dni
      }
    );
  }

  /** POST /api/usuarios/recuperar */
  recuperar(
    correo: string,
    dni: string,
    nuevaContrasena: string
  ): Observable<any> {
    // Ajusta según tu endpoint de recuperar
    return this.http.post(
      `${this.base}/recuperar`,
      {
        correo,
        dni,
        newPassword: nuevaContrasena
      }
    );
  }
}




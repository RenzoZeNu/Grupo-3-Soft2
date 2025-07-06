import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  usuario: { id: number; correo: string; rol: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Base apuntando a tu API de usuarios
  private base = 'http://localhost:3000/api/usuarios';

  private _currentUser = new BehaviorSubject<LoginResponse['usuario'] | null>(null);
  public  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {
    // ← No auto-login
  }

  get currentUserValue(): LoginResponse['usuario'] | null {
    return this._currentUser.value;
  }

  /** Login: POST /api/usuarios/login */
  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.base}/login`,
        { correo, password }
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', JSON.stringify(res.token));
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this._currentUser.next(res.usuario);
        })
      );
  }

  /** Registrar: POST /api/usuarios/registrar */
  registrar(
    nombre: string,
    correo: string,
    password: string,
    dni: string
  ): Observable<any> {
    return this.http.post(
      `${this.base}/registrar`,
      { nombre, correo, password, dni }
    );
  }

  /** Recuperar/Cambiar contraseña: POST /api/usuarios/cambiar-contrasena */
  recuperar(correo: string, dni: string, password: string): Observable<any> {
    return this.http.post(
      `${this.base}/cambiar-contrasena`,
      { correo, dni, password }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._currentUser.next(null);
  }
}

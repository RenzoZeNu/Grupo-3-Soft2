import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  usuario: { id: number; correo: string; rol: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:3000/api/usuarios';
  private _currentUser = new BehaviorSubject<LoginResponse['usuario'] | null>(null);
  public  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {
    // ← ¡Eliminado el auto-login desde localStorage!
  }

  /** Getter para el guard */
  get currentUserValue(): LoginResponse['usuario'] | null {
    return this._currentUser.value;
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.base}/login`,
        { correo, password: contrasena }
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this._currentUser.next(res.usuario);
        })
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
      { nombre, correo, password: contrasena, dni }
    );
  }

  recuperar(correo: string, dni: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(
      `${this.base}/cambiar-contrasena`,
      { correo, dni, password: nuevaContrasena }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._currentUser.next(null);
  }
}

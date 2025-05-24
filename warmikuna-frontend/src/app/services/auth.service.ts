import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  registrar(data: any) {
    return this.http.post(`${this.baseUrl}/registrar`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
  }

  logout() {
  localStorage.removeItem('token');
  }

  recuperarContrasena(data: any) {
  return this.http.post(`${this.baseUrl}/recuperar-contrasena`, data);
  }

}

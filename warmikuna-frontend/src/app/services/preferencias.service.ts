import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Preferencias {
  idioma: 'es' | 'qu' | 'ay' | 'en';
  modoDaltonico: boolean;
}

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private base = '/api/usuarios';
  constructor(private http: HttpClient) {}
  actualizar(p: Preferencias) {
    return this.http.put(`${this.base}/preferencias`, p);
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Preferencias {
  idioma: 'es' | 'qu' | 'ay';
  modoDaltonico: boolean;
}

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private base = '/api/usuarios';
  constructor(private http: HttpClient) {}

  actualizar(prefs: Preferencias) {
    return this.http.put(`${this.base}/preferencias`, prefs);
  }
}

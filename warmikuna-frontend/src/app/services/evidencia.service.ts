import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evidencia {
  id: number;
  denunciaId: number;
  tipo: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  // Mismo patrón: backend en 3000
  private base = 'http://localhost:3000/api/evidencias';

  constructor(private http: HttpClient) {}

  subir(
    denunciaId: string,
    tipo: string,
    url: string
  ): Observable<Evidencia> {
    return this.http.post<Evidencia>(
      this.base,
      { denunciaId, tipo, url }
    );
  }
}



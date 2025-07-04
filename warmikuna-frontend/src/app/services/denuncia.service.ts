import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Denuncia {
  id: number;
  descripcion: string;
  anonima: boolean;
  estado: string;
  creada_en: string;
  evidenciaArchivo: string | null;
  correo_usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  // Apunta directo a tu backend
  private base = 'http://localhost:3000/api/denuncias';

  constructor(private http: HttpClient) {}

  crear(
    descripcion: string,
    anonima: boolean
  ): Observable<Denuncia> {
    return this.http.post<Denuncia>(
      this.base,
      { descripcion, anonima }
    );
  }

  obtenerPorCorreo(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(this.base);
  }
}




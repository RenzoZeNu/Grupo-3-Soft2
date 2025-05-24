import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private baseUrl = 'http://localhost:3000/api/denuncias';

  constructor(private http: HttpClient) {}

  crearDenuncia(data: any) {
    const token = localStorage.getItem('token');

    return this.http.post(this.baseUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  obtenerMisDenuncias() {
  const token = localStorage.getItem('token');
  return this.http.get(`${this.baseUrl}/mis-denuncias`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

}

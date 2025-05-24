import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  private baseUrl = 'http://localhost:3000/api/evidencias';

  constructor(private http: HttpClient) {}

  subirEvidencia(data: any) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

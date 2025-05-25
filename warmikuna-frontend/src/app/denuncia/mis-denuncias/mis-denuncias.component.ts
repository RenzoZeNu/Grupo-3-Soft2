import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DenunciaService } from '../../services/denuncia.service';

@Component({
  selector: 'app-mis-denuncias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-denuncias.component.html'
})
export class MisDenunciasComponent implements OnInit {
  denuncias: any[] = [];

  constructor(private denunciaService: DenunciaService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';

    this.denunciaService.obtenerMisDenuncias(token).subscribe({
      next: (data: any) => {
        this.denuncias = data;
      },
      error: (err) => {
        console.error('Error al obtener denuncias:', err);
      }
    });
  }
}

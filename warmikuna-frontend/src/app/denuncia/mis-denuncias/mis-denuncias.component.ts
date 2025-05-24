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
  error: string = '';

  constructor(private denunciaService: DenunciaService) {}

  ngOnInit(): void {
    this.denunciaService.obtenerMisDenuncias().subscribe({
      next: (res: any) => this.denuncias = res.denuncias,
      error: (err: any) => this.error = err.error?.error || 'Error al cargar denuncias'
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenunciaService, Denuncia } from '../../services/denuncia.service';

@Component({
  selector: 'app-admin-denuncias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-denuncias.component.html',
  styleUrls: ['./admin-denuncias.component.css']
})
export class AdminDenunciasComponent implements OnInit {
  denuncias: Denuncia[] = [];
  filterTerm = '';

  constructor(private svc: DenunciaService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  /** Carga todas las denuncias */
  private loadAll(): void {
    this.svc.obtenerTodas().subscribe(list => this.denuncias = list);
  }

  /** Filtrado interno */
  get filteredDenuncias(): Denuncia[] {
    if (!this.filterTerm) return this.denuncias;
    const term = this.filterTerm.toLowerCase();
    return this.denuncias.filter(d =>
      d.correo_usuario.toLowerCase().includes(term) ||
      d.descripcion.toLowerCase().includes(term)
    );
  }

  /**
   * Guarda el estado de una denuncia concreta
   */
  guardarEstado(d: Denuncia): void {
    this.svc.actualizarEstado(d.id, d.estado)
      .subscribe({
        next: updated => {
          // actualizar localmente con la respuesta por si backend hace algo extra
          d.estado = updated.estado;
          // opcional: mostrar un toast o mensaje de confirmación
        },
        error: err => {
          console.error('Error guardando estado:', err);
          // opcional: mostrar alerta de error
        }
      });
  }
}

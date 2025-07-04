import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { EvidenciaService, Evidencia } from '../../services/evidencia.service';

@Component({
  selector: 'app-evidencia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './evidencia-form.component.html',
  styleUrls: ['./evidencia-form.component.css']
})
export class EvidenciaFormComponent {
  denunciaId = '';
  tipo      = 'imagen';
  url       = '';
  mensaje?: string;
  error?: string;

  constructor(
    private service: EvidenciaService,
    private translate: TranslateService
  ) {}

  subirEvidencia() {
    this.mensaje = undefined;
    this.error = undefined;
    this.service.subir(this.denunciaId, this.tipo, this.url)
      .subscribe({
        next: (evid: Evidencia) => {
          this.mensaje = this.translate.instant('EVIDENCIA.SUCCESS');
          // limpiar campos
          this.denunciaId = '';
          this.tipo = 'imagen';
          this.url = '';
        },
        error: err => {
          this.error = err.error?.message || err.message;
        }
      });
  }
}



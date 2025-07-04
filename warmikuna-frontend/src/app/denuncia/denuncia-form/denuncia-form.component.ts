import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { DenunciaService, Denuncia } from '../../services/denuncia.service';

@Component({
  selector: 'app-denuncia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './denuncia-form.component.html',
  styleUrls: ['./denuncia-form.component.css']
})
export class DenunciaFormComponent {
  descripcion = '';
  anonima = false;
  mensaje?: string;
  error?: string;

  constructor(
    private service: DenunciaService,
    private router: Router,
    private translate: TranslateService
  ) {}

  enviarDenuncia() {
    this.mensaje = undefined;
    this.error = undefined;
    this.service.crear(this.descripcion, this.anonima)
      .subscribe({
        next: (denuncia: Denuncia) => {
          // Éxito: muestra mensaje y redirige a Mis Denuncias
          this.mensaje = this.translate.instant('FORMULARIO_DENUNCIA.SUCCESS');
          // Opcional: limpiar formulario
          this.descripcion = '';
          this.anonima = false;
          // Navegar para que el usuario vea su lista
          setTimeout(() => this.router.navigate(['/mis-denuncias']), 1000);
        },
        error: err => {
          this.error = err.error?.message || err.message;
        }
      });
  }
}



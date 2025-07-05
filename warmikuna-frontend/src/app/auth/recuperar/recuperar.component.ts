import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService }    from '../../services/auth.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  correo = '';
  dni = '';
  nuevaContrasena = '';
  mensaje?: string;
  error?: string;

  constructor(
    private auth: AuthService,
    private translate: TranslateService
  ) {}

  recuperarContrasena() {
    this.auth
      .recuperar(this.correo, this.dni, this.nuevaContrasena)
      .subscribe({
        next: () => {
          this.mensaje = this.translate.instant('RECOVER.SUCCESS');
        },
        error: err => {
          this.error = err.error?.error || err.error?.message || err.message;
        }
      });
  }
}




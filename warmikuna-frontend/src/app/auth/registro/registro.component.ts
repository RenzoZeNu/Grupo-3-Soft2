import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService }   from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  dni = '';
  mensaje?: string;
  error?: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  registrar() {
    this.auth
      .registrar(this.nombre, this.correo, this.contrasena, this.dni)
      .subscribe({
        next: () => {
          this.mensaje = this.translate.instant('REGISTER.SUCCESS');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          // Si vienen errores de validación
          if (err.error?.errores) {
            this.error = err.error.errores.map((e: any) => e.msg).join(', ');
          } else {
            // O error genérico
            this.error = err.error?.error || err.message;
          }
        }
      });
  }
}




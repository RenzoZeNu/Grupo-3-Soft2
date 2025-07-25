import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService }  from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  dni = '';
  error?: string;
  success?: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  registrar() {
    this.auth.registrar(this.nombre, this.correo, this.contrasena, this.dni)
      .subscribe({
        next: () => {
          this.success = this.translate.instant('REGISTER.SUCCESS');
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: err => {
          this.error = err.error?.message || err.message;
        }
      });
  }
}

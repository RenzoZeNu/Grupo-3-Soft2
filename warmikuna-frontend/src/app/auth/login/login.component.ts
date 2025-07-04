import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  mensaje?: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  login() {
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: (res: LoginResponse) => {
        // 1) Guarda el token para futuras llamadas protegidas
        localStorage.setItem('token', res.token);
        // 2) Navega a la pantalla principal
        this.router.navigate(['/denunciar']);
      },
      error: () => {
        this.mensaje = this.translate.instant('LOGIN.ERROR');
      }
    });
  }
}



// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule }       from '@ngx-translate/core';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo     = '';
  contrasena = '';
  error?: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = undefined;
    console.log('Intentando login', this.correo, this.contrasena);
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: (res: LoginResponse) => {
        console.log('Login OK', res.usuario);
        // Redirige según rol
        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/admin'], { replaceUrl: true });
        } else {
          this.router.navigate(['/denunciar'], { replaceUrl: true });
        }
      },
      error: err => {
        console.error('Error login', err);
        this.error =
          err.error?.error ||
          err.error?.message ||
          err.message;
      }
    });
  }
}

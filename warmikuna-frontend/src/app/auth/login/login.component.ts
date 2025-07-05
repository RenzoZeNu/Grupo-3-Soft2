// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService }   from '../../services/auth.service';

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
  error?: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  login() {
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: () => {
        // Una vez logueado, redirige a la pantalla de usuario normal
        this.router.navigate(['/denunciar']);
      },
      error: err => {
        // Muestra el mensaje de error traducido o genérico
        this.error = err.error?.error || err.error?.message || err.message;
      }
    });
  }
}


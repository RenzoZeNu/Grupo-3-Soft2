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
  console.log('Intentando login', this.correo, this.contrasena);
  this.auth.login(this.correo, this.contrasena).subscribe({
    next: () => {
      console.log('Login OK');
      this.router.navigate(['/denunciar']);
    },
    error: err => {
      console.error('Error login', err);
      this.error = err.error?.error || err.error?.message || err.message;
    }
  });
}

}


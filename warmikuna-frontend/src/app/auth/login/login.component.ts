import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.mensaje = 'Inicio de sesión exitoso';
        this.router.navigate(['/denunciar']); 
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'Credenciales inválidas';
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  irARecuperar() {
  this.router.navigate(['/recuperar']);
  }

}

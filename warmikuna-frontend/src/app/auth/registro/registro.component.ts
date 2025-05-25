import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  form: FormGroup;
  mensaje: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
  }

  registrar() {
    if (this.form.invalid) return;

    this.authService.registrar(this.form.value).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje;
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = '';
        this.error = err.error?.error || 'Error al registrar';
      }
    });
  }
}

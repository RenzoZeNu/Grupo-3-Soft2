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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
  }

  registrar() {
    if (this.form.invalid) return;

    this.authService.registrar(this.form.value).subscribe({
      next: (res: any) => {
        window.alert('✅ Registro completado exitosamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        window.alert(err.error?.error || '❌ Error al registrar');
      }
    });
  }
}


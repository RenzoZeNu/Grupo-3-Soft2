import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html'
})
export class RecuperarComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  recuperar() {
    if (this.form.invalid) return;

    this.authService.recuperarContrasena(this.form.value).subscribe({
      next: () => {
        window.alert('✅ Contraseña actualizada exitosamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        window.alert(err.error?.error || '❌ Error al recuperar contraseña');
      }
    });
  }
}

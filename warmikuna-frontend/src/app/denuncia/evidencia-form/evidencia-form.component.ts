import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EvidenciaService } from '../../services/evidencia.service';

@Component({
  selector: 'app-evidencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evidencia-form.component.html'
})
export class EvidenciaFormComponent {
  form: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private evidenciaService: EvidenciaService) {
    this.form = this.fb.group({
      denunciaId: ['', Validators.required],
      tipo: ['', Validators.required], // imagen, video, audio
      url: ['', Validators.required]
    });
  }

  enviar() {
    if (this.form.invalid) return;

    this.evidenciaService.subirEvidencia(this.form.value).subscribe({
      next: (res: any) => this.mensaje = res.mensaje,
      error: (err: any) => this.mensaje = err.error?.error || 'Error al subir evidencia'
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DenunciaService } from '../../services/denuncia.service';


@Component({
  selector: 'app-denuncia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './denuncia-form.component.html'
})
export class DenunciaFormComponent {
  form: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private denunciaService: DenunciaService) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      anonima: [true] // por defecto la denuncia será anónima
    });
  }

  enviar() {
    if (this.form.invalid) return;

    this.denunciaService.crearDenuncia(this.form.value).subscribe({
      next: (res: any) => this.mensaje = res.mensaje,
      error: (err) => this.mensaje = err.error?.error || 'Error al enviar la denuncia'
    });
  }
}

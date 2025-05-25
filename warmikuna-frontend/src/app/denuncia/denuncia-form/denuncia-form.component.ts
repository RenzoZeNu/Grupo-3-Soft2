import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DenunciaService } from '../../services/denuncia.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-denuncia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './denuncia-form.component.html'
})
export class DenunciaFormComponent {
  form: FormGroup;
  mensaje: string = '';
  archivoSeleccionado: File | null = null;

  constructor(
    private fb: FormBuilder,
    private denunciaService: DenunciaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      anonima: [false]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  enviar() {
    const formData = new FormData();
    formData.append('descripcion', this.form.value.descripcion);
    formData.append('anonima', this.form.value.anonima);

    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    const token = localStorage.getItem('token') || '';

    this.denunciaService.crearConArchivo(formData, token).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje;
        this.form.reset();
        this.archivoSeleccionado = null;
        setTimeout(() => this.router.navigate(['/mis-denuncias']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err.error?.error || 'Error al registrar la denuncia con archivo';
      }
    });
  }
}

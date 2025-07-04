import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { DenunciaService, Denuncia } from '../../services/denuncia.service';

@Component({
  selector: 'app-mis-denuncias',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './mis-denuncias.component.html',
  styleUrls: ['./mis-denuncias.component.css']
})
export class MisDenunciasComponent implements OnInit {
  denuncias: Denuncia[] = [];
  error?: string;

  constructor(
    private service: DenunciaService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.service.obtenerPorCorreo().subscribe({
      next: d => this.denuncias = d,
      error: err => this.error = err.error?.message || err.message
    });
  }
}



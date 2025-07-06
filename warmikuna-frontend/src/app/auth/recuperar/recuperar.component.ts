import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService }  from '../../services/auth.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  correo = '';
  dni = '';
  nuevaContrasena = '';
  error?: string;
  success?: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  recuperar() {
    this.auth.recuperar(this.correo, this.dni, this.nuevaContrasena)
      .subscribe({
        next: () => {
          this.success = this.translate.instant('RECOVER.SUCCESS');
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: err => {
          this.error = err.error?.message || err.message;
        }
      });
  }
}

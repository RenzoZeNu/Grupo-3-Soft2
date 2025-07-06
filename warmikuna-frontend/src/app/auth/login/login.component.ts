import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error?: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: () => this.router.navigate(['/denunciar'], { replaceUrl: true }),
      error: e  => this.error = e.error?.message || e.message
    });
  }
}

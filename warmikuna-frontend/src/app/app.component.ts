import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import {
  PreferenciasService,
  Preferencias
} from './services/preferencias.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  idioma: 'es' | 'qu' | 'ay' | 'en' = 'es';
  modoDaltonico = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private prefs: PreferenciasService
  ) {}

  ngOnInit() {
    // Registrar idiomas y fallback
    this.translate.addLangs(['es','qu','ay','en']);
    this.translate.setDefaultLang('es');

    // Leer idioma guardado o usar default
    const savedLang = localStorage.getItem('idioma') as any;
    this.idioma = savedLang || this.translate.getDefaultLang();
    this.translate.use(this.idioma);

    // Inicializar modo daltónico
    this.modoDaltonico = localStorage.getItem('modoDaltonico') === 'true';
    this.applyDalton(this.modoDaltonico);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  onIdiomaChange() {
    this.translate.use(this.idioma);
    localStorage.setItem('idioma', this.idioma);
    this.savePrefs();
  }

  onModoDaltonicoChange() {
    this.applyDalton(this.modoDaltonico);
    localStorage.setItem('modoDaltonico', String(this.modoDaltonico));
    this.savePrefs();
  }

  private applyDalton(on: boolean) {
    document.body.classList[on ? 'add' : 'remove']('color-blind');
  }

  private savePrefs() {
    const p: Preferencias = {
      idioma: this.idioma,
      modoDaltonico: this.modoDaltonico
    };
    this.prefs.actualizar(p).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}





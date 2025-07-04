import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { PreferenciasService, Preferencias }
  from './services/preferencias.service';

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
  idioma: 'es'|'qu'|'ay'|'en' = 'es';
  modoDaltonico = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private prefs: PreferenciasService
  ) {}

  ngOnInit() {
    this.translate.addLangs(['es','qu','ay','en']);
    this.translate.setDefaultLang('es');
    const saved = localStorage.getItem('idioma') as any;
    this.idioma = saved || this.translate.getDefaultLang();
    this.translate.use(this.idioma);
    this.modoDaltonico = localStorage.getItem('modoDaltonico')==='true';
    document.body.classList[this.modoDaltonico?'add':'remove']('color-blind');
  }

  isLoggedIn() { return !!localStorage.getItem('token'); }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  onIdiomaChange() {
    this.translate.use(this.idioma);
    localStorage.setItem('idioma', this.idioma);
    this.prefs.actualizar({ idioma: this.idioma, modoDaltonico: this.modoDaltonico })
      .subscribe();
  }
  onModoDaltonicoChange() {
    document.body.classList[this.modoDaltonico?'add':'remove']('color-blind');
    localStorage.setItem('modoDaltonico', String(this.modoDaltonico));
    this.prefs.actualizar({ idioma: this.idioma, modoDaltonico: this.modoDaltonico })
      .subscribe();
  }
}







import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PreferenciasService, Preferencias } from '../services/preferencias.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  idioma: 'es' | 'qu' | 'ay' | 'en' = 'es';
  modoDaltonico = false;

  constructor(
    private translate: TranslateService,
    private prefs: PreferenciasService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.idioma = (localStorage.getItem('idioma') as any) || this.translate.currentLang as any || 'es';
    this.modoDaltonico = localStorage.getItem('modoDaltonico') === 'true';
    this.applyColorBlind(this.modoDaltonico);
  }

  applyColorBlind(on: boolean) {
    if (on) this.renderer.addClass(document.body, 'color-blind');
    else   this.renderer.removeClass(document.body, 'color-blind');
  }

  guardar() {
    this.translate.use(this.idioma);
    this.applyColorBlind(this.modoDaltonico);
    localStorage.setItem('idioma', this.idioma);
    localStorage.setItem('modoDaltonico', String(this.modoDaltonico));
    const prefs: Preferencias = { idioma: this.idioma, modoDaltonico: this.modoDaltonico };
    this.prefs.actualizar(prefs).subscribe(() => {
      alert(this.translate.instant('SETTINGS.SAVED'));
    });
  }
}


import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
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
  idioma: 'es' | 'qu' | 'ay';
  modoDaltonico = false;

  constructor(
    private translate: TranslateService,
    private prefs: PreferenciasService,
    private renderer: Renderer2
  ) {
    this.idioma = this.translate.currentLang as any || 'es';
  }

  ngOnInit() {
    this.applyColorBlind(this.modoDaltonico);
  }

  applyColorBlind(on: boolean) {
    if (on) this.renderer.addClass(document.body, 'color-blind');
    else   this.renderer.removeClass(document.body, 'color-blind');
  }

  guardar() {
    // 1) Cambiar idioma
    this.translate.use(this.idioma);
    // 2) Aplicar filtro daltónico
    this.applyColorBlind(this.modoDaltonico);
    // 3) Guardar en backend
    const prefs: Preferencias = {
      idioma: this.idioma,
      modoDaltonico: this.modoDaltonico
    };
    this.prefs.actualizar(prefs)
      .subscribe(() => alert(this.translate.instant('SETTINGS.SAVED')));
  }
}

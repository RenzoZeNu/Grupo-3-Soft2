// src/main.ts
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication }  from '@angular/platform-browser';
import { provideRouter }          from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule }            from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader }    from '@ngx-translate/http-loader';

import { AppComponent } from './app/app.component';
import { routes }       from './app/app.routes';

// Crea el loader para ngx-translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),    // para HttpClient
    importProvidersFrom(FormsModule),         // para ngModel
    importProvidersFrom(
      TranslateModule.forRoot({               // para | translate
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
}).catch(err => console.error(err));


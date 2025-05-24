import { Routes } from '@angular/router';
import { RegistroComponent } from './auth/registro/registro.component';
import { LoginComponent } from './auth/login/login.component';
import { DenunciaFormComponent } from './denuncia/denuncia-form/denuncia-form.component';
import { EvidenciaFormComponent } from './denuncia/evidencia-form/evidencia-form.component';
import { MisDenunciasComponent } from './denuncia/mis-denuncias/mis-denuncias.component';
import { redirectAuthenticatedGuard } from './guards/redirect-authenticated.guard';
import { RecuperarComponent } from './auth/recuperar/recuperar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [redirectAuthenticatedGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [redirectAuthenticatedGuard] },
  { path: 'denunciar', component: DenunciaFormComponent },
  { path: 'adjuntar', component: EvidenciaFormComponent },
  { path: 'mis-denuncias', component: MisDenunciasComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'recuperar', component: RecuperarComponent, canActivate: [redirectAuthenticatedGuard] },
];


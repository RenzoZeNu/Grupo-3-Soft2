// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent }            from './auth/login/login.component';
import { RegistroComponent }         from './auth/registro/registro.component';
import { RecuperarComponent }        from './auth/recuperar/recuperar.component';

import { DenunciaFormComponent }     from './denuncia/denuncia-form/denuncia-form.component';
import { EvidenciaFormComponent }    from './denuncia/evidencia-form/evidencia-form.component';
import { MisDenunciasComponent }     from './denuncia/mis-denuncias/mis-denuncias.component';

import { AdminHomeComponent }        from './admin/admin-home/admin-home.component.ts';
import { AdminDenunciasComponent }   from './admin/admin-denuncias/admin-denuncias.component.ts';
import { AdminUsuariosComponent }    from './admin/admin-usuarios/admin-usuarios.component.ts';

import { redirectAuthenticatedGuard } from './guards/redirect-authenticated.guard';
import { AuthGuard }                 from './guards/auth.guard';
import { AdminGuard }                from './guards/admin.guard';
export const routes: Routes = [
  // públicas
  { path: 'login',    component: LoginComponent,     canActivate: [redirectAuthenticatedGuard] },
  { path: 'registro', component: RegistroComponent,   canActivate: [redirectAuthenticatedGuard] },
  { path: 'recuperar',component: RecuperarComponent,  canActivate: [redirectAuthenticatedGuard] },

  // usuario normal
  { path: 'denunciar',      component: DenunciaFormComponent, canActivate: [AuthGuard] },
  { path: 'adjuntar',       component: EvidenciaFormComponent, canActivate: [AuthGuard] },
  { path: 'mis-denuncias',  component: MisDenunciasComponent,  canActivate: [AuthGuard] },

  // rutas de admin
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '',             component: AdminHomeComponent },
      { path: 'denuncias',    component: AdminDenunciasComponent },
      { path: 'usuarios',     component: AdminUsuariosComponent },
    ]
  },

  // fallback
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


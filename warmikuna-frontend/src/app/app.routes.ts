// File: src/app/app.routes.ts

import { Routes } from '@angular/router';

// ✏️ RUTAS PÚBLICAS
import { LoginComponent }     from './auth/login/login.component';
import { RegistroComponent }  from './auth/registro/registro.component';
import { RecuperarComponent } from './auth/recuperar/recuperar.component';

// ✏️ RUTAS USUARIO
import { DenunciaFormComponent }  from './denuncia/denuncia-form/denuncia-form.component';
import { EvidenciaFormComponent } from './denuncia/evidencia-form/evidencia-form.component';
import { MisDenunciasComponent }   from './denuncia/mis-denuncias/mis-denuncias.component';

// ✏️ GUARDS
import { redirectAuthenticatedGuard } from './guards/redirect-authenticated.guard';
import { AuthGuard }                  from './guards/auth.guard';
import { AdminGuard }                 from './guards/admin.guard';
import { UserGuard }                  from './guards/user.guard';

// ✏️ RUTAS ADMIN
import { AdminHomeComponent }      from './admin/admin-home/admin-home.component';
import { AdminDenunciasComponent } from './admin/admin-denuncias/admin-denuncias.component';
import { AdminUsuariosComponent }  from './admin/admin-usuarios/admin-usuarios.component';

export const routes: Routes = [
  // públicas
  { path: 'login',     component: LoginComponent,    canActivate: [redirectAuthenticatedGuard] },
  { path: 'registro',  component: RegistroComponent, canActivate: [redirectAuthenticatedGuard] },
  { path: 'recuperar', component: RecuperarComponent, canActivate: [redirectAuthenticatedGuard] },

  // rutas de usuario logueado (solo rol 'user')
  {
    path: 'denunciar',
    component: DenunciaFormComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'adjuntar',
    component: EvidenciaFormComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'mis-denuncias',
    component: MisDenunciasComponent,
    canActivate: [AuthGuard, UserGuard]
  },

  // panel de admin (solo rol 'admin')
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '',           redirectTo: 'denuncias', pathMatch: 'full' },
      { path: 'denuncias',  component: AdminDenunciasComponent },
      { path: 'usuarios',   component: AdminUsuariosComponent }
    ]
  },

  // redirect base y wildcard
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

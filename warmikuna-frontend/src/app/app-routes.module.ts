// src/app/app-routes.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// --- Componentes de auth (standalone) ---
import { LoginComponent }        from './auth/login/login.component';
import { RegistroComponent }     from './auth/registro/registro.component';
import { RecuperarComponent }    from './auth/recuperar/recuperar.component';

// --- Componentes de usuario (standalone) ---
import { DenunciaFormComponent }  from './denuncia/denuncia-form/denuncia-form.component';
import { EvidenciaFormComponent } from './denuncia/evidencia-form/evidencia-form.component';
import { MisDenunciasComponent }  from './denuncia/mis-denuncias/mis-denuncias.component';

// --- Componentes de admin (standalone) ---
import { AdminHomeComponent }      from './admin/admin-home/admin‐home.component';
import { AdminDenunciasComponent } from './admin/admin-denuncias/admin‐denuncias.component';
import { AdminUsuariosComponent }  from './admin/admin-usuarios/admin‐usuarios.component';

// --- Guards (standalone functions) ---
import { redirectAuthenticatedGuard } from './guards/redirect-authenticated.guard';
import { AuthGuard }                  from './guards/auth.guard';
import { AdminGuard }                 from './guards/admin.guard';

const routes: Routes = [
  // Auth
  { path: 'login',     component: LoginComponent,   canActivate: [redirectAuthenticatedGuard] },
  { path: 'registro',  component: RegistroComponent,canActivate: [redirectAuthenticatedGuard] },
  { path: 'recuperar', component: RecuperarComponent,canActivate: [redirectAuthenticatedGuard] },

  // Usuario
  { path: 'denunciar',     component: DenunciaFormComponent,  canActivate: [AuthGuard] },
  { path: 'adjuntar',      component: EvidenciaFormComponent, canActivate: [AuthGuard] },
  { path: 'mis-denuncias', component: MisDenunciasComponent,  canActivate: [AuthGuard] },

  // Admin (hijitas)
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '',          component: AdminHomeComponent },
      { path: 'denuncias', component: AdminDenunciasComponent },
      { path: 'usuarios',  component: AdminUsuariosComponent },
    ]
  },

  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule {}

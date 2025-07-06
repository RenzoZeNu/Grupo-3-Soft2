import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const redirectAuthenticatedGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const user   = auth.currentUserValue;

  if (!user) {
    // no está logueado → deja pasar a /login, /registro, /recuperar
    return true;
  }

  // Si es admin → lo mandamos al panel
  if (user.rol === 'admin') {
    return router.parseUrl('/admin');
  }

  // Si es user → va a la vista de denuncia
  return router.parseUrl('/denunciar');
};

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const UserGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUserValue;

  // Solo usuarios con rol 'user'
  if (user?.rol === 'user') {
    return true;
  }

  // Admin o no logueado van al dashboard de admin o login
  return router.parseUrl(user ? '/admin' : '/login');
};

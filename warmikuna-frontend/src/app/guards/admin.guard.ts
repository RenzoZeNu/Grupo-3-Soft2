import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const user   = auth.currentUserValue;
  if (user?.rol === 'admin') return true;
  return router.parseUrl('/mis-denuncias');
};

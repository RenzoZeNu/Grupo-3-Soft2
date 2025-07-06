import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.currentUserValue
    ? true
    : router.parseUrl('/login');
};

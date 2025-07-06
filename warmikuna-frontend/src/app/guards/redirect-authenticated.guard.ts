import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const redirectAuthenticatedGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.currentUserValue
    ? router.parseUrl('/denunciar')
    : true;
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const redirectAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('token');

  if (isLoggedIn) {
    router.navigate(['/denunciar']); // o cualquier otra ruta protegida
    return false;
  }

  return true;
};

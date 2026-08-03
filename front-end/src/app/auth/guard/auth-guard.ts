import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutheService } from '../services/authe';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AutheService);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};
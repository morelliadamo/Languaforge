import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import {AuthServiceService} from '../services/auth-service.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (authService.getAccesToken()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

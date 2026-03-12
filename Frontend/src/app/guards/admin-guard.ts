import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (!authService.getAccesToken()) {
    return router.createUrlTree(['/login']);
  }

  return authService
    .isAdmin()
    .pipe(
      map((isAdmin) => (isAdmin ? true : router.createUrlTree(['/login']))),
    );
};

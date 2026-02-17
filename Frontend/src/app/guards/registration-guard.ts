import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const registrationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const fromRegistration = navigation?.extras?.state?.['fromRegistration'];

  if (fromRegistration) {
    return true;
  }

  // Redirect to home if accessed directly
  router.navigate(['/']);
  return false;
};

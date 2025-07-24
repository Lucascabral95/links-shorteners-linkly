import { inject, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return true;
  }
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    router.navigate(['/dashboard/my-links']);
    return false;
  }

  return true;
};

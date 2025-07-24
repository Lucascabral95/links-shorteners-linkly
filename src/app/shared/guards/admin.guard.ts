import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const AdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const isAdmin = inject(AuthService).isAdmin();

  if (!isAdmin) {
    router.navigate(['/dashboard/my-links']);
    return false;
  }

  return true;
};

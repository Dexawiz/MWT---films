import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users-service';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  const loggedId = usersService.isLoggedIn();
  if (loggedId) return true;
  usersService.navigateAfterLogin = state.url;
  return router.parseUrl('/login');
};

import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { UsersService } from '../services/users-service';
import { Observable } from 'rxjs';

const internalGuard = (url: string):boolean | Observable<boolean> | UrlTree => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  const loggedId = usersService.isLoggedIn();
  if (loggedId) return true;
  usersService.navigateAfterLogin = url;
  return router.parseUrl('/login');
}

export const authGuard: CanActivateFn = (route, state) => {
  return internalGuard(state.url);
};
export const authMatchGuard: CanMatchFn = (route,segments):boolean | Observable<boolean> | UrlTree => {
  return internalGuard(route.path || '');
}

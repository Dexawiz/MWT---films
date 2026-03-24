import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsersService } from '../services/users-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usersService = inject(UsersService);
  const token = usersService.token;
  if (token) {
    const authReq = req.clone({
      setHeaders: {'X-Auth-Token': token}
    });
    return next(authReq);
  }
  return next(req);
};

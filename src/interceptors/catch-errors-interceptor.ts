import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { UsersService } from '../services/users-service';
import { inject } from '@angular/core';

export const catchErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const usersService = inject(UsersService);
  return next(req).pipe(
    catchError(err => usersService.processError(err))
  );
};

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AutheService } from '../services/authe';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AutheService);

  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
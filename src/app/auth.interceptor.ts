import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
      },
    })
  );
};

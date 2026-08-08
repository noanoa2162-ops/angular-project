import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't logout on 401 for auth endpoints (login/register)
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      
      if (error.status === 401 && !isAuthEndpoint) {
        // Unauthorized - token expired or invalid
        authService.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};

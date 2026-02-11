import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip adding token for auth endpoints (login/register)
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  
  if (isAuthEndpoint) {
    // Don't add Authorization header for login/register
    return next(req);
  }

  const token = authService.getToken();

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

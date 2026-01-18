import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🔍 JWT Interceptor - URL:', req.url);
  console.log('🔍 JWT Interceptor - Token présent:', !!token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('🔍 JWT Interceptor - Header ajouté:', authReq.headers.get('Authorization'));
    return next(authReq);
  }

  console.log('🔍 JWT Interceptor - Pas de token, requête sans auth');
  return next(req);
};
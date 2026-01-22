import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const token = isBrowser ? localStorage.getItem('authToken') : null;
  
  if (token) {
    try {
      console.debug('[AuthInterceptor] Attaching Authorization header to', req.url, 'token:', token.substring(0, 10) + '...');
    } catch {}
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  try {
    console.debug('[AuthInterceptor] No token found for', req.url);
  } catch {}
  return next(req);
};

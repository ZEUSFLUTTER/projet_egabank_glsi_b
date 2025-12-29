import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  register(payload: any): Observable<any> {
    return this.api.post('/auth/register', payload);
  }

  login(payload: any): Observable<any> {
    return this.api.post('/auth/login', payload).pipe(
      tap((res: any) => {
        if (res?.accessToken) localStorage.setItem('accessToken', res.accessToken);
        if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.api.post(`/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`, null);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

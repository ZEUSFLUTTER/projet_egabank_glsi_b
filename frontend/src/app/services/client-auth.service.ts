import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ClientLoginRequest, ClientAuthResponse } from '../models/client-auth.model';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'client_auth_token';
  private currentClientSubject = new BehaviorSubject<string | null>(this.getClientEmail());
  public currentClient$ = this.currentClientSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: ClientLoginRequest): Observable<ClientAuthResponse> {
    return this.http.post<ClientAuthResponse>(`${this.apiUrl}/client/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setClientEmail(response.username);
        this.currentClientSubject.next(response.username);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('client_email');
    this.currentClientSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setClientEmail(email: string): void {
    localStorage.setItem('client_email', email);
  }

  private getClientEmail(): string | null {
    return localStorage.getItem('client_email');
  }

  getCurrentClientEmail(): string | null {
    return this.currentClientSubject.value;
  }
}

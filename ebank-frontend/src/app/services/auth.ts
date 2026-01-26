import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode"; 

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private host: string = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<string> {
    return this.http.post(`${this.host}/login`, { username, password }, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem("jwt-token", token);
        })
      );
  }

  public getToken() {
    return localStorage.getItem("jwt-token");
  }

  public logout() {
    localStorage.removeItem("jwt-token");
  }

  // Lit le rôle stocké dans le Token
  public getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role; // Correspond au .claim("role", role) du java spring boot de mon cide cote serveur
    } catch (e) {
      return '';
    }
  }

  public isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  public isUser(): boolean {
    return this.getRole() === 'USER';
  }
}
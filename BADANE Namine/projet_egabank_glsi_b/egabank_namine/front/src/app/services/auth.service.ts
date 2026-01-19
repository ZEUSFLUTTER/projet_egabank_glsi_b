import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private apiService: ApiService, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.login({username, password}).subscribe({
        next: (response) => {
          if (response && response.user) {
            this.currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            resolve(true);
          } else {
            reject(new Error('Réponse invalide'));
          }
        },
        error: (err) => reject(err)
      });
    });
  }

  register(userData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.register(userData).subscribe({
        next: (response) => {
          if (response) {
            resolve(true);
          } else {
            reject(new Error('Échec de l\'inscription'));
          }
        },
        error: (err) => reject(err)
      });
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }
}
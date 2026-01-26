import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  hasRole(role: 'CLIENT' | 'AGENT' | 'ADMIN'): boolean {
    return this.userSubject.value?.role === role;
  }
}
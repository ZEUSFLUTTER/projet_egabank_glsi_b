import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private userDataSubject = new BehaviorSubject<any>(null);
  private accountsSubject = new BehaviorSubject<any[]>([]);
  private transactionsSubject = new BehaviorSubject<any[]>([]);
  
  public userData$ = this.userDataSubject.asObservable();
  public accounts$ = this.accountsSubject.asObservable();
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {}

  setUserData(userData: any): void {
    this.userDataSubject.next(userData);
  }

  getUserData(): any {
    return this.userDataSubject.value;
  }

  setAccounts(accounts: any[]): void {
    this.accountsSubject.next(accounts);
  }

  getAccounts(): any[] {
    return this.accountsSubject.value;
  }

  setTransactions(transactions: any[]): void {
    this.transactionsSubject.next(transactions);
  }

  getTransactions(): any[] {
    return this.transactionsSubject.value;
  }

  clearCache(): void {
    this.userDataSubject.next(null);
    this.accountsSubject.next([]);
    this.transactionsSubject.next([]);
  }

  // Méthode pour forcer le rechargement de toutes les données
  refreshAll(): void {
    // Cette méthode sera appelée par les composants pour signaler qu'ils doivent recharger
    this.clearCache();
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : PUT
  putData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : Suppression
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : Récupère les comptes de l'utilisateur connecté
  getMyAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/compte/mes-comptes`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Méthode corrigée : Crée un compte pour l'utilisateur connecté
  createMyAccount(accountData: any): Observable<any> {
    // Appelle l'endpoint existant dans le backend
    return this.http.post<any>(`${this.baseUrl}/compte/create`, accountData, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : Récupère les transactions de l'utilisateur connecté
  getMyTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/transaction/my-transactions`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Méthode corrigée : Récupère les transactions de l'utilisateur connecté en PDF
  downloadUserTransactionsPdf(): Observable<Blob> { // <--- Renommée pour plus de clarté
    return this.http.get(`${this.baseUrl}/transaction/my-transactions/pdf`, {
      headers: this.getHeaders(),
      responseType: 'blob' // Important pour le téléchargement
    });
  }

  // ✅ Nouvelle méthode : Récupère les transactions d'un compte spécifique en PDF
  getTransactionsByAccountPdf(accountId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/transaction/compte/${accountId}/pdf`, {
      headers: this.getHeaders(),
      responseType: 'blob' // Important pour le téléchargement
    });
  }

  // ✅ Nouvelle méthode : Récupère TOUTES les transactions en PDF (ADMIN seulement)
  getAllTransactionsPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/transaction/all-transactions/pdf`, {
      headers: this.getHeaders(),
      responseType: 'blob' // Important pour le téléchargement
    });
  }

  // ✅ Nouvelle méthode : Effectuer un dépôt
  makeDeposit(accountId: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/compte/${accountId}/depot`;
    // Le backend Spring Boot attend le montant en query parameter
    const params = `?montant=${amount}`;
    const fullUrl = `${url}${params}`;

    return this.http.post(fullUrl, {}, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : Effectuer un retrait
  makeWithdrawal(accountId: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/compte/${accountId}/retrait`;
    const params = `?montant=${amount}`;
    const fullUrl = `${url}${params}`;

    return this.http.post(fullUrl, {}, {
      headers: this.getHeaders()
    });
  }

  // ✅ Nouvelle méthode : Effectuer un virement
  makeTransfer(sourceAccountId: string, destAccountId: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/compte/virement`;
    // Le backend Spring Boot attend les paramètres en query parameters
    const params = `?compteSourceId=${sourceAccountId}&compteDestId=${destAccountId}&montant=${amount}`;
    const fullUrl = `${url}${params}`;

    return this.http.post(fullUrl, {}, {
      headers: this.getHeaders()
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Compte, CompteRequestClient, CompteRequestAdmin, Transaction, ReleveResponse, OperationRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes';

  constructor(private http: HttpClient) {}

  // Création de compte par le client connecté
  createForConnectedClient(request: CompteRequestClient): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, request);
  }

  // Création de compte par l'admin
  createForAnyClient(request: CompteRequestAdmin): Observable<Compte> {
    return this.http.post<Compte>(`${this.apiUrl}/admin`, request);
  }

  // Liste des comptes d'un client (ADMIN)
  listByClient(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // Liste des comptes du client connecté
  listMyComptes(): Observable<Compte[]> {
    console.log('🔍 CompteService: Appel API pour récupérer mes comptes');
    console.log('🌐 URL:', `${this.apiUrl}/mes-comptes`);
    
    return this.http.get<Compte[]>(`${this.apiUrl}/mes-comptes`).pipe(
      tap(comptes => {
        console.log('✅ CompteService: Comptes reçus:', comptes);
        console.log('📊 Nombre de comptes:', comptes.length);
      }),
      catchError(error => {
        console.error('❌ CompteService: Erreur lors de la récupération des comptes:', error);
        console.error('📋 Détails de l\'erreur:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        throw error;
      })
    );
  }

  // Obtenir un compte par numéro
  getByNumero(numero: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${numero}`);
  }

  // Supprimer un compte
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Opérations (dépôt, retrait, virement)
  executeOperation(request: OperationRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/operations`, request);
  }

  // Transactions d'un compte
  getTransactions(numero: string, debut: string, fin: string): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('debut', debut)
      .set('fin', fin);
    return this.http.get<Transaction[]>(`${this.apiUrl}/${numero}/transactions`, { params });
  }

  // Relevé JSON
  getReleve(numero: string, debut: string, fin: string): Observable<ReleveResponse> {
    const params = new HttpParams()
      .set('debut', debut)
      .set('fin', fin);
    return this.http.get<ReleveResponse>(`${this.apiUrl}/${numero}/releve`, { params });
  }

  // Relevé PDF
  getRelevePdf(numero: string, debut: string, fin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('debut', debut)
      .set('fin', fin);
    return this.http.get(`${this.apiUrl}/${numero}/releve/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}

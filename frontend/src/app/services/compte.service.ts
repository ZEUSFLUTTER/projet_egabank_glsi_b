import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  create(compte: any): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, compte);
  }

  update(id: number, compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.apiUrl}/${id}`, compte);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activer(id: number): Observable<Compte> {
    return this.http.patch<Compte>(`${this.apiUrl}/${id}/activer`, {});
  }

  desactiver(id: number): Observable<Compte> {
    return this.http.patch<Compte>(`${this.apiUrl}/${id}/desactiver`, {});
  }
}

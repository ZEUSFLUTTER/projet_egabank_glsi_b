import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class CompteService {
  private host: string = "http://localhost:8080/api/comptes";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    return new HttpHeaders().set("Authorization", "Bearer " + this.authService.getToken());
  }

  
  public getAllAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.host, { headers: this.getHeaders() });
  }

  public getAccount(id: string): Observable<any> {
    return this.http.get<any>(`${this.host}/${id}`, { headers: this.getHeaders() });
  }

  public createAccount(dto: any): Observable<any> {
    return this.http.post(this.host, dto, { headers: this.getHeaders() });
  }

  public changeStatus(numCompte: string, status: string): Observable<any> {
    return this.http.put(`${this.host}/status/${numCompte}`, { status }, { headers: this.getHeaders() });
  }
}
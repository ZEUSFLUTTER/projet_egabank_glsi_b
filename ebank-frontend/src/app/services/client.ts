import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private host: string = "http://localhost:8080/api/clients";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    return new HttpHeaders().set("Authorization", "Bearer " + this.authService.getToken());
  }

  public getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(this.host, { headers: this.getHeaders() });
  }

  public getClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.host}/${id}`, { headers: this.getHeaders() });
  }

  public saveClient(client: any): Observable<any> {
    return this.http.post(this.host, client, { headers: this.getHeaders() });
  }

  public updateClient(id: number, client: any): Observable<any> {
    return this.http.put<any>(`${this.host}/${id}`, client, { headers: this.getHeaders() });
  }

  public deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.host}/${id}`, { headers: this.getHeaders() });
  }
}
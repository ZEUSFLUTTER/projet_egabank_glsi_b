import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, AccountRequest, MessageResponse, PageResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private readonly apiUrl = `${environment.apiUrl}/accounts`;

    constructor(private http: HttpClient) { }

    getAll(page = 0, size = 10): Observable<PageResponse<Account>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Account>>(this.apiUrl, { params });
    }

    getByNumber(numeroCompte: string): Observable<Account> {
        return this.http.get<Account>(`${this.apiUrl}/${numeroCompte}`);
    }

    getByClient(clientId: number): Observable<Account[]> {
        return this.http.get<Account[]>(`${this.apiUrl}/client/${clientId}`);
    }

    create(request: AccountRequest): Observable<Account> {
        return this.http.post<Account>(this.apiUrl, request);
    }

    delete(id: number): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`);
    }

    deactivate(id: number): Observable<MessageResponse> {
        return this.http.put<MessageResponse>(`${this.apiUrl}/${id}/deactivate`, {});
    }
}

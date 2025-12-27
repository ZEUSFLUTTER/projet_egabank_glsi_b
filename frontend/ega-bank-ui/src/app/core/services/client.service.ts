import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientRequest, MessageResponse, PageResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly apiUrl = `${environment.apiUrl}/clients`;

    constructor(private http: HttpClient) { }

    getAll(page = 0, size = 10): Observable<PageResponse<Client>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Client>>(this.apiUrl, { params });
    }

    search(query: string, page = 0, size = 10): Observable<PageResponse<Client>> {
        const params = new HttpParams()
            .set('q', query)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Client>>(`${this.apiUrl}/search`, { params });
    }

    getById(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    getWithAccounts(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}/details`);
    }

    create(request: ClientRequest): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, request);
    }

    update(id: number, request: ClientRequest): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: number): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`);
    }
}

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Client, ClientRequest, PageResponse } from '../models';
import { ClientService } from './client.service';

describe('ClientService', () => {
    let service: ClientService;
    let httpMock: HttpTestingController;

    const mockClient: Client = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        nomComplet: 'Jean Dupont',
        dateNaissance: '1990-05-15',
        sexe: 'MASCULIN',
        adresse: '123 Rue de la Paix',
        telephone: '+22890123456',
        courriel: 'jean.dupont@email.com',
        nationalite: 'Togolaise',
        createdAt: '2025-01-01T00:00:00',
        nombreComptes: 2
    };

    const mockPageResponse: PageResponse<Client> = {
        content: [mockClient],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                ClientService
            ]
        });

        service = TestBed.inject(ClientService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getAll', () => {
        it('should fetch paginated clients', () => {
            service.getAll(0, 10).subscribe(response => {
                expect(response.content).toHaveLength(1);
                expect(response.content[0]).toEqual(mockClient);
                expect(response.totalElements).toBe(1);
            });

            const req = httpMock.expectOne(
                req => req.url === 'http://localhost:8080/api/clients' &&
                    req.params.get('page') === '0' &&
                    req.params.get('size') === '10'
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockPageResponse);
        });

        it('should use default pagination parameters', () => {
            service.getAll().subscribe();

            const req = httpMock.expectOne(
                req => req.params.get('page') === '0' &&
                    req.params.get('size') === '10'
            );
            req.flush(mockPageResponse);
        });
    });

    describe('search', () => {
        it('should search clients by query', () => {
            const query = 'Dupont';

            service.search(query, 0, 10).subscribe(response => {
                expect(response.content[0].nom).toBe('Dupont');
            });

            const req = httpMock.expectOne(
                req => req.url === 'http://localhost:8080/api/clients/search' &&
                    req.params.get('q') === query
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockPageResponse);
        });
    });

    describe('getById', () => {
        it('should fetch a client by ID', () => {
            service.getById(1).subscribe(client => {
                expect(client).toEqual(mockClient);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients/1');
            expect(req.request.method).toBe('GET');
            req.flush(mockClient);
        });
    });

    describe('getWithAccounts', () => {
        it('should fetch a client with accounts', () => {
            const clientWithAccounts = {
                ...mockClient,
                comptes: [
                    { id: 1, numeroCompte: 'TG53...', typeCompte: 'COURANT', solde: 1000 }
                ]
            };

            service.getWithAccounts(1).subscribe(client => {
                expect(client.comptes).toBeDefined();
                expect(client.comptes?.length).toBe(1);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients/1/details');
            expect(req.request.method).toBe('GET');
            req.flush(clientWithAccounts);
        });
    });

    describe('create', () => {
        it('should create a new client', () => {
            const newClient: ClientRequest = {
                nom: 'Martin',
                prenom: 'Pierre',
                dateNaissance: '1985-03-20',
                sexe: 'MASCULIN',
                adresse: '456 Avenue de la Liberté',
                telephone: '+22899999999',
                courriel: 'pierre.martin@email.com',
                nationalite: 'Française'
            };

            const createdClient: Client = {
                ...mockClient,
                id: 2,
                nom: 'Martin',
                prenom: 'Pierre'
            };

            service.create(newClient).subscribe(client => {
                expect(client.id).toBe(2);
                expect(client.nom).toBe('Martin');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newClient);
            req.flush(createdClient);
        });
    });

    describe('update', () => {
        it('should update an existing client', () => {
            const updateRequest: ClientRequest = {
                nom: 'DupontModifié',
                prenom: 'Jean',
                dateNaissance: '1990-05-15',
                sexe: 'MASCULIN'
            };

            const updatedClient: Client = {
                ...mockClient,
                nom: 'DupontModifié'
            };

            service.update(1, updateRequest).subscribe(client => {
                expect(client.nom).toBe('DupontModifié');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients/1');
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updateRequest);
            req.flush(updatedClient);
        });
    });

    describe('delete', () => {
        it('should delete a client', () => {
            service.delete(1).subscribe(response => {
                expect(response.success).toBe(true);
                expect(response.message).toBe('Client supprimé avec succès');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients/1');
            expect(req.request.method).toBe('DELETE');
            req.flush({ success: true, message: 'Client supprimé avec succès' });
        });
    });

    describe('error handling', () => {
        it('should handle 404 error for non-existent client', () => {
            service.getById(999).subscribe({
                error: (error) => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients/999');
            req.flush('Client not found', { status: 404, statusText: 'Not Found' });
        });

        it('should handle validation errors on create', () => {
            const invalidClient: ClientRequest = {
                nom: '',
                prenom: '',
                dateNaissance: '',
                sexe: 'MASCULIN'
            };

            service.create(invalidClient).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/clients');
            req.flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
        });
    });
});

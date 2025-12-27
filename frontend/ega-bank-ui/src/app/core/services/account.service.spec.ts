import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Account, AccountRequest, PageResponse } from '../models';
import { AccountService } from './account.service';

describe('AccountService', () => {
    let service: AccountService;
    let httpMock: HttpTestingController;

    const mockAccount: Account = {
        id: 1,
        numeroCompte: 'TG53TG0000000000000000012345678',
        typeCompte: 'COURANT',
        typeCompteLibelle: 'Compte Courant',
        dateCreation: '2025-01-01T00:00:00',
        solde: 1000.00,
        actif: true,
        clientId: 1,
        clientNomComplet: 'Jean Dupont'
    };

    const mockPageResponse: PageResponse<Account> = {
        content: [mockAccount],
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
                AccountService
            ]
        });

        service = TestBed.inject(AccountService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getAll', () => {
        it('should fetch paginated accounts', () => {
            service.getAll(0, 10).subscribe(response => {
                expect(response.content).toHaveLength(1);
                expect(response.content[0]).toEqual(mockAccount);
            });

            const req = httpMock.expectOne(
                req => req.url === 'http://localhost:8080/api/accounts' &&
                    req.params.get('page') === '0'
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockPageResponse);
        });
    });

    describe('getByNumber', () => {
        it('should fetch an account by number', () => {
            const accountNumber = 'TG53TG0000000000000000012345678';

            service.getByNumber(accountNumber).subscribe(account => {
                expect(account).toEqual(mockAccount);
            });

            const req = httpMock.expectOne(`http://localhost:8080/api/accounts/${accountNumber}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockAccount);
        });
    });

    describe('getByClient', () => {
        it('should fetch accounts by client ID', () => {
            const clientId = 1;
            const mockAccounts = [mockAccount, { ...mockAccount, id: 2, typeCompte: 'EPARGNE' as const }];

            service.getByClient(clientId).subscribe(accounts => {
                expect(accounts).toHaveLength(2);
                expect(accounts[0].clientId).toBe(clientId);
            });

            const req = httpMock.expectOne(`http://localhost:8080/api/accounts/client/${clientId}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockAccounts);
        });

        it('should return empty array if client has no accounts', () => {
            service.getByClient(999).subscribe(accounts => {
                expect(accounts).toHaveLength(0);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts/client/999');
            req.flush([]);
        });
    });

    describe('create', () => {
        it('should create a new account', () => {
            const newAccount: AccountRequest = {
                typeCompte: 'EPARGNE',
                clientId: 1
            };

            const createdAccount: Account = {
                ...mockAccount,
                id: 2,
                typeCompte: 'EPARGNE',
                typeCompteLibelle: 'Compte Épargne'
            };

            service.create(newAccount).subscribe(account => {
                expect(account.typeCompte).toBe('EPARGNE');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newAccount);
            req.flush(createdAccount);
        });
    });

    describe('delete', () => {
        it('should delete an account', () => {
            service.delete(1).subscribe(response => {
                expect(response.success).toBe(true);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts/1');
            expect(req.request.method).toBe('DELETE');
            req.flush({ success: true, message: 'Compte supprimé avec succès' });
        });

        it('should handle error when deleting account with balance', () => {
            service.delete(1).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts/1');
            req.flush(
                { message: 'Impossible de supprimer: solde non nul' },
                { status: 400, statusText: 'Bad Request' }
            );
        });
    });

    describe('deactivate', () => {
        it('should deactivate an account', () => {
            service.deactivate(1).subscribe(response => {
                expect(response.success).toBe(true);
                expect(response.message).toContain('désactivé');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts/1/deactivate');
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual({});
            req.flush({ success: true, message: 'Compte désactivé avec succès' });
        });
    });

    describe('error handling', () => {
        it('should handle 404 error for non-existent account', () => {
            service.getByNumber('INVALID').subscribe({
                error: (error) => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/accounts/INVALID');
            req.flush('Account not found', { status: 404, statusText: 'Not Found' });
        });

        it('should handle network errors', () => {
            service.getAll().subscribe({
                error: (error) => {
                    expect(error.status).toBe(0);
                }
            });

            const req = httpMock.expectOne(req => req.url.includes('/api/accounts'));
            req.error(new ProgressEvent('Network error'));
        });
    });
});

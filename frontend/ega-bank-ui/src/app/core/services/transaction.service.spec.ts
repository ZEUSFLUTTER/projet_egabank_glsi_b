import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OperationRequest, Transaction, TransferRequest } from '../models';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
    let service: TransactionService;
    let httpMock: HttpTestingController;

    const mockTransaction: Transaction = {
        id: 1,
        type: 'DEPOT',
        typeLibelle: 'Dépôt',
        montant: 500.00,
        dateTransaction: '2025-01-01T10:00:00',
        description: 'Dépôt test',
        compteDestination: '',
        soldeAvant: 1000.00,
        soldeApres: 1500.00,
        numeroCompte: 'TG53TG0000000000000000012345678'
    };

    const ACCOUNT_NUMBER = 'TG53TG0000000000000000012345678';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                TransactionService
            ]
        });

        service = TestBed.inject(TransactionService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('deposit', () => {
        it('should perform a deposit', () => {
            const request: OperationRequest = {
                montant: 500,
                description: 'Dépôt test'
            };

            service.deposit(ACCOUNT_NUMBER, request).subscribe(transaction => {
                expect(transaction.type).toBe('DEPOT');
                expect(transaction.montant).toBe(500);
            });

            const req = httpMock.expectOne(
                `http://localhost:8080/api/transactions/${ACCOUNT_NUMBER}/deposit`
            );
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(request);
            req.flush(mockTransaction);
        });

        it('should handle deposit without description', () => {
            const request: OperationRequest = {
                montant: 200
            };

            service.deposit(ACCOUNT_NUMBER, request).subscribe();

            const req = httpMock.expectOne(req => req.url.includes('/deposit'));
            expect(req.request.body.description).toBeUndefined();
            req.flush({ ...mockTransaction, description: 'Dépôt' });
        });
    });

    describe('withdraw', () => {
        it('should perform a withdrawal', () => {
            const request: OperationRequest = {
                montant: 200,
                description: 'Retrait DAB'
            };

            const withdrawTransaction: Transaction = {
                ...mockTransaction,
                type: 'RETRAIT',
                typeLibelle: 'Retrait',
                soldeAvant: 1500,
                soldeApres: 1300
            };

            service.withdraw(ACCOUNT_NUMBER, request).subscribe(transaction => {
                expect(transaction.type).toBe('RETRAIT');
            });

            const req = httpMock.expectOne(
                `http://localhost:8080/api/transactions/${ACCOUNT_NUMBER}/withdraw`
            );
            expect(req.request.method).toBe('POST');
            req.flush(withdrawTransaction);
        });

        it('should handle insufficient balance error', () => {
            const request: OperationRequest = {
                montant: 10000
            };

            service.withdraw(ACCOUNT_NUMBER, request).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne(req => req.url.includes('/withdraw'));
            req.flush(
                { message: 'Solde insuffisant' },
                { status: 400, statusText: 'Bad Request' }
            );
        });
    });

    describe('transfer', () => {
        it('should perform a transfer', () => {
            const request: TransferRequest = {
                compteSource: ACCOUNT_NUMBER,
                compteDestination: 'TG53TG0000000000000000087654321',
                montant: 300,
                description: 'Virement mensuel'
            };

            const transferTransaction: Transaction = {
                ...mockTransaction,
                type: 'VIREMENT_SORTANT',
                typeLibelle: 'Virement émis',
                compteDestination: 'TG53TG0000000000000000087654321'
            };

            service.transfer(request).subscribe(transaction => {
                expect(transaction.type).toBe('VIREMENT_SORTANT');
                expect(transaction.compteDestination).toBe('TG53TG0000000000000000087654321');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/transactions/transfer');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(request);
            req.flush(transferTransaction);
        });

        it('should handle same account transfer error', () => {
            const request: TransferRequest = {
                compteSource: ACCOUNT_NUMBER,
                compteDestination: ACCOUNT_NUMBER,
                montant: 100
            };

            service.transfer(request).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/transactions/transfer');
            req.flush(
                { message: 'Source et destination identiques' },
                { status: 400, statusText: 'Bad Request' }
            );
        });
    });

    describe('getHistory', () => {
        it('should fetch transaction history for a period', () => {
            const transactions = [
                mockTransaction,
                { ...mockTransaction, id: 2, type: 'RETRAIT' as const }
            ];

            service.getHistory(ACCOUNT_NUMBER, '2025-01-01', '2025-12-31').subscribe(result => {
                expect(result).toHaveLength(2);
            });

            const req = httpMock.expectOne(
                req => req.url.includes('/history') &&
                    req.params.get('debut') === '2025-01-01' &&
                    req.params.get('fin') === '2025-12-31'
            );
            expect(req.request.method).toBe('GET');
            req.flush(transactions);
        });

        it('should return empty array for period without transactions', () => {
            service.getHistory(ACCOUNT_NUMBER, '2020-01-01', '2020-12-31').subscribe(result => {
                expect(result).toHaveLength(0);
            });

            const req = httpMock.expectOne(req => req.url.includes('/history'));
            req.flush([]);
        });
    });

    describe('getAllByAccount', () => {
        it('should fetch all transactions for an account', () => {
            const transactions = [
                mockTransaction,
                { ...mockTransaction, id: 2 },
                { ...mockTransaction, id: 3 }
            ];

            service.getAllByAccount(ACCOUNT_NUMBER).subscribe(result => {
                expect(result).toHaveLength(3);
            });

            const req = httpMock.expectOne(
                `http://localhost:8080/api/transactions/${ACCOUNT_NUMBER}`
            );
            expect(req.request.method).toBe('GET');
            req.flush(transactions);
        });
    });

    describe('downloadStatement', () => {
        it('should download a statement as PDF', () => {
            const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });

            service.downloadStatement(ACCOUNT_NUMBER, '2025-01-01', '2025-12-31').subscribe(blob => {
                expect(blob).toBeInstanceOf(Blob);
            });

            const req = httpMock.expectOne(
                req => req.url.includes('/statements/') &&
                    req.params.get('debut') === '2025-01-01'
            );
            expect(req.request.method).toBe('GET');
            expect(req.request.responseType).toBe('blob');
            req.flush(pdfBlob);
        });
    });

    describe('error handling', () => {
        it('should handle account not found error', () => {
            service.getAllByAccount('INVALID').subscribe({
                error: (error) => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/transactions/INVALID');
            req.flush('Account not found', { status: 404, statusText: 'Not Found' });
        });

        it('should handle inactive account error', () => {
            const request: OperationRequest = { montant: 100 };

            service.deposit(ACCOUNT_NUMBER, request).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne(req => req.url.includes('/deposit'));
            req.flush(
                { message: 'Le compte est inactif' },
                { status: 400, statusText: 'Bad Request' }
            );
        });
    });
});

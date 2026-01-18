import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of, Subject, takeUntil, timeout } from 'rxjs';
import { AccountResponse } from '../models/account.model';
import { ClientResponse } from '../models/client.model';
import { PageResponse } from '../models/page.model';
import { AccountService } from '../services/account.service';
import { ClientService } from '../services/client.service';
import { DashboardService } from '../services/dashboard.service';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { RouteHelperService } from '../services/route-helper.service';
import { AppStore } from '../stores/app.store';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    isLoading = true;
    hasError = false;
    errorMessage = '';
    isAdmin = false;
    private cdr: ChangeDetectorRef;

    stats = {
        totalClients: 0,
        totalAccounts: 0,
        totalBalance: 0,
        activeAccounts: 0,
        totalTransactions: 0
    };
    recentClients: ClientResponse[] = [];
    recentAccounts: AccountResponse[] = [];

    private destroy$ = new Subject<void>();

    // Exposer les routes pour le template
    get clientsRoute() { return this.routeHelper.getClientsRoute(); }
    get newClientRoute() { return this.routeHelper.getNewClientRoute(); }
    get accountsRoute() { return this.routeHelper.getAccountsRoute(); }
    get newAccountRoute() { return this.routeHelper.getNewAccountRoute(); }

    constructor(
        private clientService: ClientService,
        private accountService: AccountService,
        private dashboardService: DashboardService,
        private transactionService: TransactionService,
        private authService: AuthService,
        private store: AppStore,
        private routeHelper: RouteHelperService,
        cdr: ChangeDetectorRef
    ) {
        this.cdr = cdr;
    }

    ngOnInit() {
        this.isAdmin = this.authService.isAdmin();
        this.loadData();

        // S'abonner aux changements du store pour rafraîchir automatiquement
        this.store.dataChanged$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(event => {
            console.log('[Dashboard] Data change event received:', event);
            // Rafraîchir les données quand il y a un changement
            if (event.type === 'system' && event.action === 'refresh') {
                this.loadData();
            } else if (event.type === 'transaction' && event.action === 'balance_update') {
                // Mettre à jour les soldes localement si possible
                this.updateLocalBalances(event.data);
            } else if (event.type === 'account' || event.type === 'client') {
                // Rafraîchir pour les créations/suppressions
                this.loadData();
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    retry() {
        this.loadData();
    }

    private updateLocalBalances(data: { numeroCompte: string, newBalance: number }) {
        // Mettre à jour le compte dans la liste récente
        this.recentAccounts = this.recentAccounts.map(acc =>
            acc.numeroCompte === data.numeroCompte
                ? { ...acc, solde: data.newBalance }
                : acc
        );

        // Recalculer le total balance approximatif
        // (Pour une vraie mise à jour, on recharge depuis le backend)
        this.loadData();
    }

    private loadData() {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';

        console.log('[Dashboard] Starting data load...');

        if (!this.isAdmin) {
            forkJoin({
                accounts: this.accountService.getMine().pipe(
                    timeout(10000),
                    catchError(err => {
                        console.error('[Dashboard] Error loading accounts:', err);
                        return of([] as AccountResponse[]);
                    })
                ),
                transactions: this.transactionService.getMine().pipe(
                    timeout(10000),
                    catchError(err => {
                        console.error('[Dashboard] Error loading transactions:', err);
                        return of([]);
                    })
                )
            }).subscribe({
                next: ({ accounts, transactions }) => {
                    this.stats.totalClients = 0;
                    this.stats.totalAccounts = accounts.length;
                    this.stats.activeAccounts = accounts.filter(acc => acc.actif).length;
                    this.stats.totalBalance = accounts.reduce((sum, acc) => sum + (acc.solde || 0), 0);
                    this.stats.totalTransactions = transactions.length;

                    this.recentClients = [];
                    this.recentAccounts = accounts;

                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (err: any) => {
                    console.error('[Dashboard] Fatal error loading client data:', err);
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = 'Failed to load your dashboard data. Please check if the backend is running.';
                    this.cdr.detectChanges();
                }
            });
            return;
        }

        // Execute requests in parallel using forkJoin
        forkJoin({
            // Récupérer les vraies statistiques depuis le backend
            dashboardStats: this.dashboardService.getStats().pipe(
                timeout(10000),
                catchError(err => {
                    console.error('[Dashboard] Error loading stats:', err);
                    return of(null);
                })
            ),
            recentClients: this.clientService.getAll(0, 5).pipe(
                timeout(10000),
                catchError(err => {
                    console.error('[Dashboard] Error loading recentClients:', err);
                    return of({ content: [], totalElements: 0, pageNumber: 0, pageSize: 5, totalPages: 0, first: true, last: true } as PageResponse<ClientResponse>);
                })
            ),
            recentAccounts: this.accountService.getAll(0, 5).pipe(
                timeout(10000),
                catchError(err => {
                    console.error('[Dashboard] Error loading recentAccounts:', err);
                    return of({ content: [], totalElements: 0, pageNumber: 0, pageSize: 5, totalPages: 0, first: true, last: true } as PageResponse<AccountResponse>);
                })
            )
        }).subscribe({
            next: (results) => {
                console.log('[Dashboard] Received results:', results);

                const { dashboardStats, recentClients, recentAccounts } = results;

                // Utiliser les statistiques du backend si disponibles
                if (dashboardStats) {
                    this.stats.totalClients = dashboardStats.totalClients;
                    this.stats.totalAccounts = dashboardStats.totalAccounts;
                    this.stats.activeAccounts = dashboardStats.activeAccounts;
                    this.stats.totalBalance = dashboardStats.totalBalance;
                    this.stats.totalTransactions = dashboardStats.totalTransactions;
                } else {
                    // Fallback: calculer depuis les listes récentes
                    this.stats.totalClients = recentClients?.totalElements || 0;
                    this.stats.totalAccounts = recentAccounts?.totalElements || 0;
                    const sampleAccounts = recentAccounts?.content || [];
                    this.stats.totalBalance = sampleAccounts.reduce((sum, acc) => sum + (acc?.solde || 0), 0);
                    this.stats.activeAccounts = sampleAccounts.filter(a => a?.actif).length;
                }

                // Lists
                this.recentClients = recentClients?.content || [];
                this.recentAccounts = recentAccounts?.content || [];

                console.log('[Dashboard] Data loaded successfully:', {
                    totalClients: this.stats.totalClients,
                    totalAccounts: this.stats.totalAccounts,
                    activeAccounts: this.stats.activeAccounts,
                    totalBalance: this.stats.totalBalance,
                    recentClientsCount: this.recentClients.length,
                    recentAccountsCount: this.recentAccounts.length
                });

                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('[Dashboard] Fatal error loading data:', err);
                this.isLoading = false;
                this.hasError = true;
                this.errorMessage = 'Failed to load dashboard data. Please check if the backend is running.';
                this.cdr.detectChanges();
            }
        });
    }
}

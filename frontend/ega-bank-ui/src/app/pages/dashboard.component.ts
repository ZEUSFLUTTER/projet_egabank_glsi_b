import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountResponse } from '../models/account.model';
import { ClientResponse } from '../models/client.model';
import { PageResponse } from '../models/page.model';
import { AccountService } from '../services/account.service';
import { ClientService } from '../services/client.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    isLoading = true;
    stats = {
        totalClients: 0,
        totalAccounts: 0,
        totalBalance: 0,
        activeAccounts: 0
    };
    recentClients: ClientResponse[] = [];
    recentAccounts: AccountResponse[] = [];

    constructor(
        private clientService: ClientService,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.isLoading = true;

        // Execute requests in parallel using forkJoin
        forkJoin({
            clientsStats: this.clientService.getAll(0, 1), // Only need count
            accountsStats: this.accountService.getAll(0, 1), // Only need count and sample balance
            recentClients: this.clientService.getAll(0, 5), // Recent list
            recentAccounts: this.accountService.getAll(0, 5) // Recent list
        }).subscribe({
            next: (results: {
                clientsStats: PageResponse<ClientResponse>,
                accountsStats: PageResponse<AccountResponse>,
                recentClients: PageResponse<ClientResponse>,
                recentAccounts: PageResponse<AccountResponse>
            }) => {
                const { clientsStats, accountsStats, recentClients, recentAccounts } = results;

                // Stats
                this.stats.totalClients = Number(clientsStats.totalElements);
                this.stats.totalAccounts = Number(accountsStats.totalElements);

                // Lists
                this.recentClients = recentClients.content || [];
                this.recentAccounts = recentAccounts.content || [];

                // Approximate balance (still limited by backend capabilities but faster)
                // Ideally backend should provide a /stats endpoint
                const sampleAccounts = recentAccounts.content || [];
                this.stats.totalBalance = sampleAccounts.reduce((sum: number, acc: AccountResponse) => sum + (acc.solde || 0), 0);
                this.stats.activeAccounts = sampleAccounts.filter((a: AccountResponse) => a.actif).length;

                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Dashboard data load failed', err);
                this.isLoading = false;
            }
        });
    }
}

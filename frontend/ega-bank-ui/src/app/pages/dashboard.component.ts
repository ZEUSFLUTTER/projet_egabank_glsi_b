import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountResponse } from '../models/account.model';
import { ClientResponse } from '../models/client.model';
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
        // Helper to track completion
        let loaded = 0;
        const checkDone = () => {
            loaded++;
            if (loaded === 2) this.isLoading = false;
        };

        // Load Clients
        this.clientService.getAll(0, 5).subscribe({
            next: (res) => {
                this.stats.totalClients = Number(res.totalElements);
                this.recentClients = res.content || [];
                checkDone();
            },
            error: () => checkDone()
        });

        // Load Accounts
        this.accountService.getAll(0, 5).subscribe({
            next: (res) => {
                this.stats.totalAccounts = Number(res.totalElements);
                this.recentAccounts = res.content || [];
                // Approximate total balance from the first page (not accurate but better than nothing without backend agg)
                this.stats.totalBalance = this.recentAccounts.reduce((sum, acc) => sum + acc.solde, 0);
                this.stats.activeAccounts = this.recentAccounts.filter(a => a.actif).length; // Just a sample count
                checkDone();
            },
            error: () => checkDone()
        });
    }
}

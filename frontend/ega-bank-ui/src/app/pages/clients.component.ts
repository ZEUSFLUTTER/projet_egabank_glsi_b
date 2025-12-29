import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Client, mockAccounts, mockClients } from '../mock-data';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clients: Client[] = mockClients;
  accounts: Account[] = mockAccounts;
  clientBalances: { [clientId: string]: number } = {};

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.calculateBalances();
  }

  private calculateBalances(): void {
    this.clients.forEach(client => {
      const clientAccounts = this.accounts.filter(a => client.accountIds.includes(a.accountId));
      this.clientBalances[client.clientId] = clientAccounts.reduce((sum, account) => sum + account.balance, 0);
    });
  }

  viewAccounts(clientId: string) {
    this.router.navigate(['/accounts'], { queryParams: { clientId } });
  }
}

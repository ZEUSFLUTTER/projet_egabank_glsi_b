import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { mockAccounts, mockClients } from '../mock-data';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 style="font-size:24px;margin-bottom:8px;">Client Management</h1>
      <p style="color:#6b7280;margin-bottom:12px;">View and manage your bank's clients and their associations.</p>

      <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));">
        <div *ngFor="let client of clients" style="border:1px solid #e5e7eb;padding:12px;border-radius:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:600">{{client.firstName}} {{client.lastName}}</div>
              <div style="font-size:12px;color:#6b7280">{{client.clientId}}</div>
            </div>
            <div style="font-weight:700;color:#0ea5a9">{{getTotalBalance(client) | currency:'USD'}}</div>
          </div>
          <div style="margin-top:8px;color:#374151;font-size:13px">{{client.email}}</div>
          <div style="margin-top:8px;text-align:right;">
            <button (click)="viewAccounts(client.clientId)" style="border:0;background:#111827;color:white;padding:6px 10px;border-radius:6px;cursor:pointer;">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ClientsComponent {
  clients = mockClients;
  accounts = mockAccounts;

  constructor(private router: Router) {}

  getTotalBalance(client: any) {
    const clientAccounts = this.accounts.filter((a) => client.accountIds.includes(a.accountId));
    return clientAccounts.reduce((s, a) => s + a.balance, 0);
  }

  viewAccounts(clientId: string) {
    this.router.navigate(['/accounts'], { queryParams: { clientId } });
  }
}

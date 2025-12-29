import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mockAccounts, mockClients } from '../mock-data';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h1 style="font-size:24px;margin-bottom:8px">Account Management</h1>
      <p style="color:#6b7280;margin-bottom:12px;">Overview of all customer accounts and financial holdings.</p>

      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
        <thead style="background:#f3f4f6;text-transform:uppercase;font-size:12px;">
          <tr>
            <th style="padding:8px;text-align:left">Account</th>
            <th style="padding:8px;text-align:left">Client</th>
            <th style="padding:8px;text-align:left">Status</th>
            <th style="padding:8px;text-align:left">Open Date</th>
            <th style="padding:8px;text-align:right">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let account of filteredAccounts" style="border-top:1px solid #e5e7eb;">
            <td style="padding:8px">
              <div style="font-weight:600;text-transform:capitalize">{{account.accountType}} Account</div>
              <div style="font-family:monospace;font-size:12px;color:#6b7280">{{account.accountId}}</div>
            </td>
            <td style="padding:8px">{{getClientName(account.clientId)}}</td>
            <td style="padding:8px;text-transform:capitalize">{{account.status}}</td>
            <td style="padding:8px;color:#6b7280">{{account.openDate}}</td>
            <td style="padding:8px;text-align:right;font-family:monospace">{{account.balance | currency:account.currency}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AccountsComponent {
  accounts = mockAccounts;
  clients = mockClients;
  filteredAccounts = this.accounts;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((map) => {
      const clientId = map.get('clientId');
      this.filteredAccounts = clientId ? this.accounts.filter((a) => a.clientId === clientId) : this.accounts;
    });
  }

  getClientName(clientId: string) {
    const c = this.clients.find((x) => x.clientId === clientId);
    return c ? `${c.firstName} ${c.lastName}` : clientId;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Clients', href: '/clients' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
];

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  template: `
    <aside style="width:240px;border-right:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column;">
      <div style="padding:16px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;border-radius:6px;background:#0ea5a9;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">EB</div>
        <div style="font-weight:700">Ega Bank</div>
      </div>
      <nav style="flex:1;padding:12px;display:flex;flex-direction:column;gap:6px;">
        <a *ngFor="let it of items" (click)="navigate(it.href)" style="padding:8px;border-radius:6px;text-decoration:none;color:inherit;cursor:pointer;display:flex;align-items:center;gap:8px;">{{it.label}}</a>
      </nav>
      <div style="padding:12px;border-top:1px solid #f3f4f6;">
        <button style="width:100%;padding:8px;border-radius:6px;border:0;background:#f3f4f6;cursor:pointer;">Settings</button>
        <button style="width:100%;padding:8px;border-radius:6px;border:0;background:transparent;color:#dc2626;margin-top:6px;cursor:pointer;">Logout</button>
      </div>
    </aside>
  `,
})
export class AppSidebar {
  items = navItems;
  constructor(private router: Router) {}

  navigate(href: string) {
    this.router.navigateByUrl(href);
  }
}

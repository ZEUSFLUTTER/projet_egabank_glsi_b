import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'dashboard-header',
  imports: [CommonModule],
  template: `
    <header style="height:64px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 16px;">
      <div style="max-width:320px;position:relative;width:100%;">
        <input placeholder="Search clients or accounts..." style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid #e5e7eb;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button style="background:transparent;border:0;cursor:pointer;">🔔</button>
        <div style="width:40px;height:40px;border-radius:9999px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;">U</div>
      </div>
    </header>
  `,
})
export class DashboardHeader {}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-gray-600 text-sm font-medium">{{ title }}</p>
          <p class="text-4xl font-bold mt-2" [ngClass]="colorClass">{{ value }}</p>
        </div>
        <div class="rounded-lg p-3" [ngClass]="bgColorClass">
          <ng-content></ng-content>
        </div>
      </div>
      <a [routerLink]="link" class="inline-flex items-center gap-2 font-medium text-sm transition-colors" [ngClass]="colorLink">
        {{ linkText }}
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() link: string = '/';
  @Input() linkText: string = 'Voir détails';
  @Input() color: 'blue' | 'green' | 'purple' = 'blue';

  get colorClass(): string {
    const colors: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600'
    };
    return colors[this.color];
  }

  get bgColorClass(): string {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100'
    };
    return colors[this.color];
  }

  get colorLink(): string {
    const colors: Record<string, string> = {
      blue: 'text-blue-600 hover:text-blue-800',
      green: 'text-green-600 hover:text-green-800',
      purple: 'text-purple-600 hover:text-purple-800'
    };
    return colors[this.color];
  }
}

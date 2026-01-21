import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12">
      <div class="text-gray-400 text-5xl mb-4">{{ icon }}</div>
      <p class="text-gray-600 text-lg font-medium">{{ title }}</p>
      <p class="text-gray-500 text-sm">{{ subtitle }}</p>
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  @Input() icon: string = '📭';
  @Input() title: string = 'Aucune donnée trouvée';
  @Input() subtitle: string = '';
}

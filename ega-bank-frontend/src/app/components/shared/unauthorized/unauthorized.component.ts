import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
      <div style="text-align: center; max-width: 500px;">
        <div style="font-size: 120px; margin-bottom: 24px;">🚫</div>
        <h1 style="font-size: 48px; font-weight: 700; color: var(--primary-purple); margin-bottom: 16px;">Accès refusé</h1>
        <p style="font-size: 18px; color: #6B7280; margin-bottom: 32px;">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <a routerLink="/" class="btn btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}

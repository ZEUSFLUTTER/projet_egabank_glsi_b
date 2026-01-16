import { Component } from '@angular/core';

@Component({
    selector: 'app-placeholder',
    standalone: true,
    template: `
    <div class="card p-5 text-center border-0 shadow-sm">
      <i class="bi bi-cone-striped fs-1 text-warning mb-3"></i>
      <h3 class="fw-bold">Module en construction</h3>
      <p class="text-muted">Cette fonctionnalité sera disponible prochainement.</p>
      <button class="btn btn-primary mt-3" onclick="history.back()">Retour</button>
    </div>
  `
})
export class PlaceholderComponent { }

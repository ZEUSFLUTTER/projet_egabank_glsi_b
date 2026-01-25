import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer',
  imports: [FormsModule, CommonModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class TransferComponent implements OnInit {
  sourceAccountId = '';
  destinationAccountId = '';
  amount = '';
  message = '';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Récupère le compte source depuis les query params si disponible
    this.sourceAccountId = this.router.getCurrentNavigation()?.extras?.state?.['sourceAccountId'] || '';
  }

  onTransfer() {
    if (!this.sourceAccountId || !this.destinationAccountId || !this.amount) {
      this.message = 'Veuillez remplir tous les champs';
      return;
    }

    // ✅ Envoie les paramètres comme paramètres de requête
    const url = `compte/virement?compteSourceId=${this.sourceAccountId}&compteDestId=${this.destinationAccountId}&montant=${this.amount}`;
    
    this.apiService.postData(url, {}).subscribe({
      next: (response) => {
        this.message = 'Virement effectué avec succès';
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 2000);
      },
      error: (err) => {
        // ✅ Affiche le détail de l'erreur
        console.error('Erreur détaillée:', err);
        this.message = 'Erreur lors du virement: ' + err.message;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Operation, Virement } from '../../../models/transaction.model';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  comptes: Compte[] = [];
  transactionType: string = 'depot';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      compteId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
      }
    });
  }

  onTypeChange(): void {
    // Ajouter ou supprimer le champ compteDestinationId selon le type
    if (this.transactionType === 'virement') {
      this.transactionForm.addControl('compteDestinationId', this.fb.control('', Validators.required));
    } else {
      this.transactionForm.removeControl('compteDestinationId');
    }
  }

  getCompteDisplayText(compte: Compte): string {
    let text = `${compte.numeroCompte} - ${compte.typeCompte}`;
    if (compte.clientNom && compte.clientPrenom) {
      text += ` (${compte.clientPrenom} ${compte.clientNom})`;
    }
    text += ` - ${compte.solde?.toFixed(2) || '0.00'} FCFA`;
    return text;
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      if (this.transactionType === 'virement') {
        const virement: Virement = {
          compteSourceId: this.transactionForm.value.compteId,
          compteDestinationId: this.transactionForm.value.compteDestinationId,
          montant: this.transactionForm.value.montant,
          description: this.transactionForm.value.description
        };
        
        this.transactionService.faireVirement(virement).subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (error) => {
            console.error('Erreur virement:', error);
            // Si c'est une erreur 401/403, afficher le message d'erreur au lieu de rediriger
            if (error.status === 401 || error.status === 403) {
              this.errorMessage = error.error?.message || 'Vous n\'êtes pas autorisé à effectuer cette opération';
            } else {
              this.errorMessage = error.error?.message || 'Erreur lors du virement';
            }
          }
        });
      } else {
        const operation: Operation = {
          compteId: this.transactionForm.value.compteId,
          montant: this.transactionForm.value.montant,
          description: this.transactionForm.value.description
        };
        
        const serviceCall = this.transactionType === 'depot'
          ? this.transactionService.faireDepot(operation)
          : this.transactionService.faireRetrait(operation);
        
        serviceCall.subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de l\'opération';
          }
        });
      }
    }
  }
}


import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';
import { CompteService, Compte } from '../../services/compte.service';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './virement.component.html',
  styleUrls: ['./virement.component.css']
})
export class VirementComponent implements OnInit {
  montant: number = 0;
  compteDestinationId: number | null = null;
  comptes: Compte[] = [];
  loading = false;
  error = '';
  soldeActuel: number;

  constructor(
    public dialogRef: MatDialogRef<VirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compteId: number; solde: number; clientId: number },
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {
    this.soldeActuel = data.solde;
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getComptesByClient(this.data.clientId).subscribe({
      next: (comptes) => {
        // Exclure le compte source de la liste
        this.comptes = comptes.filter(c => c.id !== this.data.compteId);
      },
      error: (err) => {
        console.error('Erreur chargement comptes', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.montant <= 0) {
      this.error = 'Le montant doit être positif';
      return;
    }

    if (this.montant > this.soldeActuel) {
      this.error = 'Solde insuffisant';
      return;
    }

    if (!this.compteDestinationId) {
      this.error = 'Veuillez sélectionner un compte destination';
      return;
    }

    this.loading = true;
    this.error = '';

    this.transactionService.faireVirement(
      this.data.compteId,
      this.compteDestinationId,
      this.montant
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du virement';
        if (err.error?.errors) {
          this.error += ': ' + JSON.stringify(err.error.errors);
        }
        this.loading = false;
      }
    });
  }
}

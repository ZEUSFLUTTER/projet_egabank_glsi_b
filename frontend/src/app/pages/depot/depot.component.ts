import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-depot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent {
  montant: number = 0;
  loading = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<DepotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compteId: number },
    private transactionService: TransactionService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.montant <= 0) {
      this.error = 'Le montant doit être positif';
      return;
    }

    this.loading = true;
    this.error = '';

    this.transactionService.faireDepot(this.data.compteId, this.montant).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du dépôt';
        if (err.error?.errors) {
            this.error += ': ' + JSON.stringify(err.error.errors);
        }
        this.loading = false;
      }
    });
  }
}

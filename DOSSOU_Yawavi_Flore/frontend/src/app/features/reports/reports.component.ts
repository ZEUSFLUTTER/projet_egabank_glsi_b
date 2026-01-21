import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { ReportService } from '../../core/services/report.service';
import { HistoriqueTransactionDto, DemandeHistoriqueDto } from '../../shared/models/transaction.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  historyForm: FormGroup;
  transactions: HistoriqueTransactionDto[] = [];
  loading = false;
  errorMessage = '';

  faFilePdf = faFilePdf;
  faSearch = faSearch;
  faDownload = faDownload;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private reportService: ReportService
  ) {
    this.historyForm = this.fb.group({
      accountNumber: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
  }

  searchHistory(): void {
    if (this.historyForm.valid) {
      this.loading = true;
      const formValue = this.historyForm.value;
      const dto: DemandeHistoriqueDto = {
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        accountNumberDto: { accountNumber: formValue.accountNumber }
      };

      this.transactionService.getTransactionHistory(dto).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la recherche';
          this.loading = false;
        }
      });
    }
  }

  downloadPdf(): void {
    if (this.historyForm.valid) {
      this.loading = true;
      const formValue = this.historyForm.value;

      this.reportService.generatePdfReport(
        formValue.accountNumber,
        formValue.dateDebut,
        formValue.dateFin
      ).subscribe({
        next: (blob) => {
          this.reportService.downloadPdf(blob, 'releve-bancaire.pdf');
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la génération du PDF';
          this.loading = false;
        }
      });
    }
  }
}

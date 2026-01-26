import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OperationService } from '../../../services/operation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retrait-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './retrait-client.html',
  styleUrl: './retrait-client.scss'
})
export class RetraitClientComponent implements OnInit {
  retraitForm!: FormGroup;
  myAccounts: any[] = [];
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private opService: OperationService) {}

  ngOnInit(): void {
    this.retraitForm = this.fb.group({
      numCompte: ['', Validators.required],
      montant: [null, [Validators.required, Validators.min(100)]],
      description: ['Retrait depuis espace client', Validators.required]
    });
    this.loadMyAccounts();
  }

  loadMyAccounts() {
    this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe(data => this.myAccounts = data);
  }

  handleRetrait() {
    if (this.retraitForm.invalid) return;
    this.loading = true;

    const { numCompte, montant, description } = this.retraitForm.value;

    this.opService.retrait(numCompte, montant, description).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Succès', 'Retrait effectué avec succès', 'success');
        this.retraitForm.reset({ description: 'Retrait depuis espace client' });
        this.loadMyAccounts();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Erreur', err.error?.message || 'Solde insuffisant ou erreur technique', 'error');
      }
    });
  }
}
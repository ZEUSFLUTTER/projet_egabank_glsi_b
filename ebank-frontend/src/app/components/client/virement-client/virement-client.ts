import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OperationService } from '../../../services/operation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-virement-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './virement-client.html',
  styleUrl: './virement-client.scss'
})
export class VirementClientComponent implements OnInit {
  transferForm!: FormGroup;
  myAccounts: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private opService: OperationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMyAccounts();
  }

  initForm() {
    this.transferForm = this.fb.group({
      numCompte: ['', Validators.required],
      numCompteDest: ['', [Validators.required, Validators.minLength(5)]],
      montant: [null, [Validators.required, Validators.min(10)]],
      description: ['Virement depuis mon espace client', Validators.required]
    });
  }

  loadMyAccounts() {
    this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe({
      next: (data) => this.myAccounts = data,
      error: (err) => console.error("Erreur chargement comptes", err)
    });
  }

  onTransfer() {
    if (this.transferForm.invalid) return;
    this.loading = true;
    const { numCompte, numCompteDest, montant, description } = this.transferForm.value;

    this.opService.virement(numCompte, numCompteDest, montant, description).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Succès', `Le virement de ${montant} CFA a été effectué.`, 'success');
        this.transferForm.reset({ numCompte: '', description: 'Virement depuis mon espace client' });
        this.loadMyAccounts();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Erreur', err.error?.message || 'Virement refusé (Solde ou IBAN incorrect)', 'error');
      }
    });
  }
}
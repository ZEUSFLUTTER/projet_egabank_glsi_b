import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { OperationService } from '../../services/operation';
import { CompteService } from '../../services/compte';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './operations.html',
  styleUrl: './operations.scss'
})
export class OperationsComponent implements OnInit {
  opForm!: FormGroup;
  loading = false;
  showForm = false; 
  transactions: any[] = [];
  accounts: any[] = []; 
  
  searchIban = "";
  dateStart = "";
  dateEnd = "";

  constructor(
    private fb: FormBuilder, 
    private opService: OperationService,
    private compteService: CompteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllAccounts();
  }

  initForm() {
    this.opForm = this.fb.group({
      type: ['VERSEMENT', Validators.required],
      numCompte: ['', Validators.required],
      numCompteDest: [''],
      montant: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Gestion dynamique du champ Destinataire
    this.opForm.get('type')?.valueChanges.subscribe(type => {
      const dest = this.opForm.get('numCompteDest');
      if (type === 'VIREMENT') dest?.setValidators([Validators.required]);
      else dest?.clearValidators();
      dest?.updateValueAndValidity();
    });
  }

  loadAllAccounts() {
    this.compteService.getAllAccounts().subscribe(data => this.accounts = data);
  }

  loadHistory() {
    if (!this.searchIban || !this.dateStart || !this.dateEnd) return;
    this.loading = true;
    this.opService.getHistoryByPeriod(this.searchIban, this.dateStart, this.dateEnd).subscribe({
      next: (data) => {
        // On trie par date décroissante pour l'affichage
        this.transactions = data.sort((a:any, b:any) => 
          new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
        );
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
handleOperation() {
  if (this.opForm.invalid) return;

  const val = this.opForm.value;
  this.loading = true;

  let request;
  if (val.type === 'VERSEMENT') request = this.opService.versement(val.numCompte, val.montant, val.description);
  else if (val.type === 'RETRAIT') request = this.opService.retrait(val.numCompte, val.montant, val.description);
  else request = this.opService.virement(val.numCompte, val.numCompteDest, val.montant, val.description);

  request.subscribe({
    next: () => {
      this.loading = false;
      Swal.fire('Succès', 'Opération terminée', 'success');
      this.showForm = false;
      this.loadAllAccounts();
      if (this.searchIban === val.numCompte) this.loadHistory();
      this.opForm.reset({type: 'VERSEMENT', montant: 0});
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.loading = false;
      const msg = err.error?.message || "L'opération a échoué";
      Swal.fire('Erreur', msg, 'error'); 
      this.cdr.detectChanges();
    }
  });
}
}
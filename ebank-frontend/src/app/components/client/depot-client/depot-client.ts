import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OperationService } from '../../../services/operation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-depot-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './depot-client.html',
  styleUrl: './depot-client.scss'
})
export class DepotClientComponent implements OnInit {
  depotForm!: FormGroup;
  myAccounts: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private opService: OperationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.depotForm = this.fb.group({
      numCompte: ['', Validators.required],
      source: ['TMONEY', Validators.required], 
      montant: [null, [Validators.required, Validators.min(100), Validators.max(1000000)]]
    });
    this.loadMyAccounts();
  }

  loadMyAccounts() {
    this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe(data => {
      this.myAccounts = data;
      this.cdr.detectChanges(); 
    });
  }

  handleDepot() {
    if (this.depotForm.invalid) return;
    this.loading = true;
    const { numCompte, montant, source } = this.depotForm.value;
    const description = `Recharge via ${source}`;

    this.opService.versement(numCompte, montant, description).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Succès', `Compte crédité de ${montant} CFA`, 'success');
        this.depotForm.reset({ source: 'TMONEY' });
        this.loadMyAccounts();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
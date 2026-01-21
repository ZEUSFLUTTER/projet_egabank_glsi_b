import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompteService } from 'src/app/core/services/compte.service';
import { Compte } from 'src/app/core/models/compte.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte-form',
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.scss']
})
export class CompteFormComponent implements OnInit {
  compteForm: FormGroup;
  isEditMode: boolean = false;
  compteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private router: Router
  ) {
    this.compteForm = this.fb.group({
      balance: [0, [Validators.required, Validators.min(0)]],
      clientId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we are in edit mode and load the compte details if so
    const currentUrl = this.router.url;
    this.isEditMode = currentUrl.includes('edit');

    if (this.isEditMode) {
      this.compteId = this.extractCompteId(currentUrl);
      this.loadCompte(this.compteId);
    }
  }

  private extractCompteId(url: string): number {
    const segments = url.split('/');
    return +segments[segments.length - 1]; // Assuming the last segment is the compte ID
  }

  private loadCompte(id: number): void {
    this.compteService.getCompteById(id).subscribe((compte: Compte) => {
      this.compteForm.patchValue({
        balance: compte.balance,
        clientId: compte.clientId
      });
    });
  }

  onSubmit(): void {
    if (this.compteForm.valid) {
      const compteData: Compte = {
        id: this.compteId,
        ...this.compteForm.value
      };

      if (this.isEditMode) {
        this.compteService.updateCompte(compteData).subscribe(() => {
          this.router.navigate(['/admin/comptes']);
        });
      } else {
        this.compteService.createCompte(compteData).subscribe(() => {
          this.router.navigate(['/admin/comptes']);
        });
      }
    }
  }
}
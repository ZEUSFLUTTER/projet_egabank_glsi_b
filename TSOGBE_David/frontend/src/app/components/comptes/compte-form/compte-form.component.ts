import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { ClientService } from '../../../services/client.service';
import { Compte, TypeCompte } from '../../../models/compte.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './compte-form.component.html',
  styleUrl: './compte-form.component.css'
})
export class CompteFormComponent implements OnInit {
  compteForm: FormGroup;
  clients: Client[] = [];
  errorMessage: string = '';
  TypeCompte = TypeCompte;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.compteForm = this.fb.group({
      clientId: ['', Validators.required],
      typeCompte: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des clients';
      }
    });
  }

  onSubmit(): void {
    if (this.compteForm.valid) {
      const compteData: Compte = {
        clientId: this.compteForm.value.clientId,
        typeCompte: this.compteForm.value.typeCompte
      };
      
      this.compteService.createCompte(compteData).subscribe({
        next: () => {
          this.router.navigate(['/comptes']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        }
      });
    }
  }
}


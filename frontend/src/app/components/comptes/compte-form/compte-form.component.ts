import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { ClientService } from '../../../services/client.service';
import { TypeCompte } from '../../../models/compte.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.css']
})
export class CompteFormComponent implements OnInit {

  clients: Client[] = [];
  error = '';
  TypeCompte = TypeCompte;
  form!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      typeCompte: ['', Validators.required]
    });

    this.clientService.getAllClients().subscribe({
      next: c => this.clients = c,
      error: () => this.error = 'Impossible de charger les clients'
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.compteService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/comptes']),
      error: err => this.error = err.error?.message || 'Erreur création'
    });
  }
}

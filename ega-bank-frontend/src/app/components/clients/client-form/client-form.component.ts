import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { NavbarComponent } from '../../navbar/navbar.component';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  client: Client = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'MASCULIN',
    adresse: '',
    numeroTelephone: '',
    courriel: '',
    nationalite: ''
  };

  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  clientId: number | null = null;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clientId = Number(params['id']);
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.isLoading = true;

    this.clientService.getClientById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.client = data;
        },
        error: (error) => {
          console.error('Erreur chargement client:', error);
          this.errorMessage = 'Erreur lors du chargement du client';
        }
      });
  }

  prepareClientPayload(): Client {
    // Remplit les champs obligatoires si vides pour éviter le 400
    return {
      nom: this.client.nom?.trim() || 'Nom par défaut',
      prenom: this.client.prenom?.trim() || 'Prénom par défaut',
      dateNaissance: this.client.dateNaissance || '2000-01-01',
      sexe: this.client.sexe || 'MASCULIN',
      adresse: this.client.adresse?.trim() || 'Adresse par défaut',
      numeroTelephone: this.client.numeroTelephone?.trim() || '0000000000',
      courriel: this.client.courriel?.trim() || 'test@example.com',
      nationalite: this.client.nationalite?.trim() || 'Togolaise'
    };
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.prepareClientPayload();
    console.log('JSON envoyé:', JSON.stringify(payload));

    const request$ = this.isEditMode && this.clientId
      ? this.clientService.updateClient(this.clientId, payload)
      : this.clientService.createClient(payload);

    request$
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          this.errorMessage =
            error.error?.message ||
            JSON.stringify(error.error) ||
            'Erreur lors de l’enregistrement du client';
        }
      });
  }
}

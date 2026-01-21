import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CompteCreateDTO, CompteService } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-new-account',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule
    ],
    templateUrl: './new-account.component.html',
    styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class NewAccountComponent {

    newAccountForm: CompteCreateDTO = {
        clientId: 0,
        typeCompte: 'COURANT'
    };
    clients: any[] = [];
    loadingClients = false;

    constructor(
        public dialogRef: MatDialogRef<NewAccountComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { clientId: number | null, isAdmin: boolean },
        private compteService: CompteService,
        private clientService: ClientService
    ) {
        if (data.clientId) {
            this.newAccountForm.clientId = data.clientId;
        }

        if (data.isAdmin) {
            this.loadClients();
        }
    }

    loadClients(): void {
        this.loadingClients = true;
        this.clientService.getAllClients().subscribe({
            next: (clients) => {
                this.clients = clients;
                this.loadingClients = false;
            },
            error: (err) => {
                console.error('Erreur chargement clients', err);
                this.loadingClients = false;
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (!this.newAccountForm.clientId || !this.newAccountForm.typeCompte) {
            // Validation basique
            return;
        }

        this.compteService.createCompte(this.newAccountForm).subscribe({
            next: (compte) => {
                this.dialogRef.close(true); // Return true to indicate success/refresh needed
            },
            error: (err) => {
                console.error('Erreur création compte', err);
                alert('Erreur: ' + (err.error?.message || 'Inconnue'));
            }
        });
    }
}

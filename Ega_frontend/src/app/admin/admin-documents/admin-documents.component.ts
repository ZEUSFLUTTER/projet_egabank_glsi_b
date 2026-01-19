import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../_services/admin.service';
import { AccountService } from '../../_services/account.service'; // Réutilisation pour le téléchargement
import { Client } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-documents.component.html',
})
export class AdminDocumentsComponent {
  adminService = inject(AdminService);
  accountService = inject(AccountService);

  searchQuery = '';
  foundClient: Client | null = null;
  foundCompteNumero = ''; // Pour stocker le numéro valide trouvé

  search() {
    if (!this.searchQuery) return;

    // Ici on suppose que le backend a un endpoint de recherche qui renvoie le client à partir du compte
    this.adminService.searchClientByCompte(this.searchQuery).subscribe({
      next: (client) => {
        this.foundClient = client;
        this.foundCompteNumero = this.searchQuery; // On garde le numéro pour les actions
      },
      error: () => {
        this.foundClient = null;
        Swal.fire('Introuvable', 'Aucun client associé à ce numéro de compte.', 'error');
      }
    });
  }

  downloadRib() {
    if (!this.foundCompteNumero) return;
    this.accountService.downloadRib(this.foundCompteNumero).subscribe((response) => {
       this.handleDownload(response);
    });
  }

  downloadReleve() {
    if (!this.foundCompteNumero) return;
    // Par défaut : Mois en cours
    const date = new Date();
    const debut = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    this.accountService.downloadReleve(this.foundCompteNumero, debut, fin).subscribe((response) => {
        this.handleDownload(response);
    });
  }

  private handleDownload(response: any) {
    const blob = new Blob([response.body], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getFileName(response) || 'document.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private getFileName(response: any): string | null {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
      return matches && matches[1] ? matches[1] : null;
    }
    return null;
  }
}

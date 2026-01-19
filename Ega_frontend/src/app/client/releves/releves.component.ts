import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { AccountService } from '../../_services/account.service';
import { User, Compte, Client } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-releves',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './releves.component.html',
})
export class RelevesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  authService = inject(AuthService);
  router = inject(Router);

  user: User | null = null;
  client: Client | null = null;
  comptes: Compte[] = [];

  isSidebarOpen = false;

  // Variables pour le formulaire de relevé
  selectedCompteForReleve: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  isLoadingPdf = false;

  maxDate: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    this.route.data.subscribe(data => {
      const resolvedData = data['donnees'];
      if (resolvedData) {
        this.comptes = resolvedData.comptes;
        this.client = resolvedData.clientInfos;

        if (this.comptes.length > 0) {
          this.selectedCompteForReleve = this.comptes[0].numeroCompte;
        }
      }
    });
  }

  // --- ACTIONS ---

  onDownloadRib(compte: Compte) {
    this.isLoadingPdf = true;
    this.accountService.downloadRib(compte.numeroCompte).subscribe({
      next: (response) => {
        this.downloadFile(response.body, this.getFileName(response.headers));
        this.isLoadingPdf = false;
      },
      error: () => {
        this.isLoadingPdf = false;
        Swal.fire('Erreur', 'Impossible de générer le RIB.', 'error');
      }
    });
  }

  /**
   * Télécharger le Relevé selon les dates avec VÉRIFICATION PRÉALABLE
   */
  onDownloadReleve() {
    // 1. Vérification des champs vides
    if (!this.selectedCompteForReleve || !this.dateDebut || !this.dateFin) {
      Swal.fire('Attention', 'Veuillez sélectionner un compte et une période.', 'warning');
      return;
    }

    // On récupère la date du jour
    const today = new Date().toISOString().split('T')[0];

    if (this.dateFin > today) {
        Swal.fire('Erreur', 'La date de fin ne peut pas être ultérieure à la date du jour.', 'warning');
        return;
    }
    if (this.dateDebut > this.dateFin) {
        Swal.fire('Erreur', 'La date de début ne peut pas être après la date de fin.', 'warning');
        return;
    }

    this.isLoadingPdf = true;

    // 2. VÉRIFICATION : Y a-t-il des transactions sur cette période ?
    this.accountService.getHistorique(this.selectedCompteForReleve).subscribe({
      next: (transactions) => {
        // Création des objets Date pour comparaison précise (début à 00:00, fin à 23:59)
        const start = new Date(this.dateDebut);
        start.setHours(0, 0, 0, 0);

        const end = new Date(this.dateFin);
        end.setHours(23, 59, 59, 999);

        // Filtrer les transactions
        const transactionsInPeriod = transactions.filter(t => {
          const tDate = new Date(t.dateTransaction);
          return tDate >= start && tDate <= end;
        });

        // 3. Logique de décision
        if (transactionsInPeriod.length === 0) {
          // CAS VIDE : On arrête tout et on affiche le message
          this.isLoadingPdf = false;
          Swal.fire({
            icon: 'info',
            title: 'Aucune transaction',
            text: 'Aucune opération n\'a été trouvée sur la période sélectionnée. Le relevé n\'a pas été généré.',
            confirmButtonColor: '#9308C8'
          });
        } else {
          // CAS VALIDE : On lance le téléchargement
          this.executePdfDownload();
        }
      },
      error: () => {
        this.isLoadingPdf = false;
        Swal.fire('Erreur', 'Impossible de vérifier l\'historique du compte.', 'error');
      }
    });
  }

  // Méthode privée pour lancer l'appel API du PDF (séparée pour la lisibilité)
  private executePdfDownload() {
    this.accountService.downloadReleve(this.selectedCompteForReleve, this.dateDebut, this.dateFin).subscribe({
      next: (response) => {
        this.downloadFile(response.body, this.getFileName(response.headers));
        this.isLoadingPdf = false;
        // Petit message de succès optionnel
        const Toast = Swal.mixin({
          toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
        });
        Toast.fire({ icon: 'success', title: 'Relevé téléchargé avec succès' });
      },
      error: () => {
        this.isLoadingPdf = false;
        Swal.fire('Erreur', 'Erreur lors de la génération du PDF.', 'error');
      }
    });
  }

  // --- HELPERS PRIVÉS ---

  private downloadFile(blob: Blob | null, fileName: string) {
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private getFileName(headers: any): string {
    const contentDisposition = headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) return match[1];
    }
    return 'releve_compte.pdf';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

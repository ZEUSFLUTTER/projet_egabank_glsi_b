import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

interface AuditLog {
  id: string;
  action: string; // Ex: "CREATE_CLIENT", "DEPOT", "VIREMENT"
  userId: string; // L'ID de l'utilisateur qui a effectué l'action
  userName: string; // Facultatif : le nom/prénom de l'utilisateur
  entityType?: string; // Ex: "Client", "Compte", "Transaction" - Peut-être encore reçu mais non affiché
  entityId?: string; // L'ID de l'entité concernée - Peut-être encore reçu mais non affiché
  details?: string; // Des détails supplémentaires sur l'action
  timestamp: string; // Date et heure de l'action (format ISO)
  // Ajoute d'autres champs si ton backend envoie autre chose
}

@Component({
  selector: 'app-admin-audit-log',
  imports: [CommonModule, RouterModule, DecimalPipe], // Ajoute les imports nécessaires
  template: `
    <div class="admin-audit-log-container">
      <h2>Journal d'Audit</h2>
      <button class="back-btn" (click)="goBack()">Retour à la liste des clients</button>

      <div class="loading" *ngIf="loading">Chargement des logs d'audit...</div>
      <div class="error" *ngIf="error">Erreur lors du chargement des logs d'audit.</div>

      <table class="audit-log-table" *ngIf="logs.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Action</th>
            <th>Utilisateur</th>
            <!-- ✅ COLONNES "ENTITÉ" ET "ID ENTITÉ" SUPPRIMÉES -->
            <th>Détails</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let log of logs">
            <td>{{ log.id }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.userName || log.userId }}</td> <!-- Affiche le nom si disponible, sinon l'ID -->
            <!-- ✅ CELLULES "ENTITÉ" ET "ID ENTITÉ" SUPPRIMÉES -->
            <td>{{ log.details || '-' }}</td>
            <td>{{ log.timestamp | date:'medium' }}</td> <!-- Formate la date -->
          </tr>
        </tbody>
      </table>

      <div class="empty-state" *ngIf="logs.length === 0 && !loading && !error">
        Aucun log d'audit trouvé.
      </div>
    </div>
  `,
  styles: [`
    .admin-audit-log-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
    }

    .back-btn {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
    }

    .back-btn:hover {
      background-color: #5a6268;
    }

    .audit-log-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .audit-log-table th,
    .audit-log-table td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    .audit-log-table th {
      background-color: #34495e;
      color: white;
    }

    .audit-log-table tr:nth-child(even) {
      background-color: #ecf0f1;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 1rem;
      font-style: italic;
      color: #666;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class AdminAuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  error = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef // Pour forcer la détection de changement si nécessaire
  ) { }

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    this.error = false;
    this.cdr.detectChanges(); // Force la mise à jour pour afficher "Chargement..."

    // Appelle l'endpoint GET /api/admin/logs
    this.apiService.getData('admin/logs').subscribe({
      next: (data: any) => { // <--- Typage temporaire 'any', adapte selon la structure réelle
        console.log('Logs d\'audit reçus:', data);
        // Selon la structure de ta réponse API
        // Si la réponse est directement un tableau de logs
        if (Array.isArray(data)) {
          this.logs = data as AuditLog[];
        } else if (data && data.logs && Array.isArray(data.logs)) {
          // Si la réponse est enveloppée dans une propriété 'logs'
          this.logs = data.logs as AuditLog[];
        } else {
          // Autre structure possible
          console.warn('Structure de réponse des logs d\'audit inattendue:', data);
          this.logs = [];
        }
        this.loading = false;
        this.cdr.detectChanges(); // Force la mise à jour pour masquer "Chargement..." et afficher le tableau
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des logs d\'audit:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges(); // Force la mise à jour pour afficher l'erreur
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
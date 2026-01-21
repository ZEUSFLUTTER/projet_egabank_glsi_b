import { Component, OnInit, inject, signal } from '@angular/core';
import { GesadminService } from '../../services/gesadmin.service';
import { User as AdminModel } from '../../models/user.model';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShieldCheck, Search, Edit, Trash2, LucideAngularModule, Mail, Phone, Key, Plus, RefreshCcw, AlertTriangle
} from 'lucide-angular';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [DatePipe, LucideAngularModule, RouterLink],
  templateUrl: './ges-admin.html',
  styleUrl: './ges-admin.css'
})
export class GesAdmin implements OnInit {

  // Icônes Lucide
  readonly IconAdmin = ShieldCheck;
  readonly Search = Search;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Key = Key;
  readonly Plus = Plus;
  readonly RefreshCcw = RefreshCcw;
  readonly AlertTriangle = AlertTriangle;
  admins: AdminModel[] = [];
  adminsFiltres: AdminModel[] = [];
  adminToDelete: AdminModel | null = null;

  private snack = inject(MatSnackBar);
  private adminService = inject(GesadminService);

  showDeleteModal = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    this.chargerAdmins();
  }

  chargerAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.adminsFiltres = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement admins', err);
        this.loading.set(false);
        this.snack.open('Erreur de connexion au serveur', 'X', { duration: 3000 });
      }
    });
  }

  isConfirmModalOpen = false;
  adminToReset: any = null;
  isResetting = false;

  openResetConfirm(admin: any) {
    this.adminToReset = admin;
    this.isConfirmModalOpen = true;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();

    if (!query) {
      this.adminsFiltres = this.admins;
      return;
    }

    this.adminsFiltres = this.admins.filter(a =>
      a.nom.toLowerCase().includes(query) ||
      a.prenom.toLowerCase().includes(query) ||
      a.username.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query)
    );
  }

  openDeleteModal(admin: AdminModel): void {
    this.adminToDelete = admin;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.adminToDelete = null;
  }

  confirmDelete(): void {
    if (!this.adminToDelete?.id) return;

    const id = this.adminToDelete.id;

    this.adminService.deleteAdmin(id).subscribe({
      next: (response) => {
        this.admins = this.admins.filter(a => a.id !== id);
        this.adminsFiltres = this.adminsFiltres.filter(a => a.id !== id);

        this.closeDeleteModal();
        this.snack.open(response, 'X', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (err) => {
        console.error('Erreur suppression admin', err);
        this.snack.open('Impossible de supprimer cet administrateur', 'X', { duration: 3000 });
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ";
    if (role === 'SUPER_ADMIN') return base + "bg-purple-100 text-purple-700 border border-purple-200";
    if (role === 'ADMIN') return base + "bg-blue-100 text-blue-700 border border-blue-200";
    return base + "bg-gray-100 text-gray-700 border border-gray-200";
  }

confirmReset() {
  if (this.adminToReset) {
    const adminName = `${this.adminToReset.prenom} ${this.adminToReset.nom}`;
    
    // 1. Fermer la modale immédiatement pour une UI réactive
    this.isConfirmModalOpen = false;

    // 2. Lancer l'appel au service
    this.adminService.resetAdminPassword(this.adminToReset.id).subscribe({
      next: (response) => {
        // 3. Afficher la réponse du serveur via le Snack déjà présent dans ton code
        this.snack.open(response, 'Succès', {
          duration: 4000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        console.error("Erreur reset", err);
        this.snack.open(`Erreur lors de la réinitialisation pour ${adminName}`, 'X', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // On réinitialise l'objet temporaire
    this.adminToReset = null;
    this.isResetting = false;
  }
}

closeConfirmModal() {
  this.isConfirmModalOpen = false;
  this.adminToReset = null;
  this.isResetting = false;
}

// Variables d'état pour la modification
isEditModalOpen = false;
adminToEdit: AdminModel | null = null;

// Ouvrir la modale avec les données de l'admin sélectionné
openEditModal(admin: AdminModel) {
  this.adminToEdit = { ...admin };
  this.isEditModalOpen = true;
}

closeEditModal() {
  this.isEditModalOpen = false;
  this.adminToEdit = null;
}

  confirmUpdate() {
    if (this.adminToEdit && this.adminToEdit.id) {
      this.adminService.updateAdmin(this.adminToEdit.id, this.adminToEdit).subscribe({
        next: (response) => {
          // Mettre à jour la liste locale
          const index = this.admins.findIndex(a => a.id === this.adminToEdit?.id);
          if (index !== -1) this.admins[index] = this.adminToEdit!;
          
          this.snack.open("Informations mises à jour avec succès", "OK", { duration: 3000 });
          this.closeEditModal();
        },
        error: () => this.snack.open("Erreur lors de la mise à jour", "X", { duration: 3000 })
      });
    }
  }
} 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompteService } from '../../services/compte';
import { OperationService } from '../../services/operation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss'
})
export class AccountDetailsComponent implements OnInit {
  account: any = null;
  numCompte!: string;

  constructor(
    private route: ActivatedRoute,
    private compteService: CompteService,
    private operationService: OperationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.numCompte = this.route.snapshot.params['id']; 
    this.loadAccount();
  }

  loadAccount() {
    this.compteService.getAccount(this.numCompte).subscribe({
      next: (data: any) => {
        if (data.operations) {
          data.operations.sort((a: any, b: any) => 
            new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
          );
        }
        this.account = data;
        this.cdr.detectChanges();
      }
    });
  }

  async handleOperation(type: 'CREDIT' | 'DEBIT') {
    const title = type === 'CREDIT' ? 'Effectuer un versement' : 'Effectuer un retrait';
    const { value: formValues } = await Swal.fire({
      title: title,
      html:
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Montant (CFA)">' +
        '<input id="swal-input2" type="text" class="swal2-input" placeholder="Description">',
      showCancelButton: true,
      preConfirm: () => [
        (document.getElementById('swal-input1') as HTMLInputElement).value,
        (document.getElementById('swal-input2') as HTMLInputElement).value
      ]
    });

    if (formValues && formValues[0]) {
      const montant = parseFloat(formValues[0]);
      if (montant <= 0 || isNaN(montant)) {
        Swal.fire('Erreur', 'Veuillez saisir un montant positif', 'error');
        return;
      }

      const obs = type === 'CREDIT' ? 
        this.operationService.versement(this.numCompte, montant, formValues[1]) : 
        this.operationService.retrait(this.numCompte, montant, formValues[1]);

      obs.subscribe({
        next: () => {
          Swal.fire('Succès', 'Opération réussie', 'success');
          this.loadAccount();
        },
        error: (err) => {
          const msg = err.error?.message || "Action impossible";
          Swal.fire('Erreur', msg, 'error');
        }
      });
    }
  }

  async handleVirement() {
    const { value: formValues } = await Swal.fire({
      title: 'Virement',
      html:
        '<input id="swal-dest" class="swal2-input" placeholder="IBAN Destinataire">' +
        '<input id="swal-amount" type="number" class="swal2-input" placeholder="Montant">' +
        '<input id="swal-desc" class="swal2-input" placeholder="Motif">',
      showCancelButton: true,
      preConfirm: () => [
        (document.getElementById('swal-dest') as HTMLInputElement).value,
        (document.getElementById('swal-amount') as HTMLInputElement).value,
        (document.getElementById('swal-desc') as HTMLInputElement).value
      ]
    });

    if (formValues && formValues[0] && formValues[1]) {
      const montant = parseFloat(formValues[1]);
      if (montant <= 0) return;

      this.operationService.virement(this.numCompte, formValues[0], montant, formValues[2]).subscribe({
        next: () => {
          Swal.fire('Succès', 'Virement effectué', 'success');
          this.loadAccount();
        },
        error: (err) => {
          const msg = err.error?.message || "Échec du virement";
          Swal.fire('Erreur', msg, 'error');
        }
      });
    }
  }

  toggleAccountStatus() {
    const action = this.account.status === 'ACTIVATED' ? 'SUSPENDED' : 'ACTIVATED';
    this.compteService.changeStatus(this.numCompte, action).subscribe({
      next: () => { this.loadAccount(); }
    });
  }

  closeAccount() {
    Swal.fire({
      title: 'Fermer le compte ?',
      text: "Action irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, clôturer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.compteService.changeStatus(this.numCompte, 'CLOSED').subscribe({
          next: () => { this.loadAccount(); }
        });
      }
    });
  }
}
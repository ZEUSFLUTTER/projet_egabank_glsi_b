import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompteService } from '../../services/compte';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-compte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-compte.html'
})
export class NewCompteComponent implements OnInit {
  compteForm!: FormGroup;
  clientId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private compteService: CompteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // On récupère l'ID du client depuis l'URL 
    this.clientId = this.route.snapshot.params['clientId'];
    
    this.compteForm = this.fb.group({
      type: ['COURANT', Validators.required],
      decouvert: [500, [Validators.min(0)]],
      tauxInteret: [0],
      devis: ['CFA', Validators.required],
      clientId: [this.clientId]
    });
  }

  handleSave() {
    let data = this.compteForm.value;
    // Sécurité pour backend : on nettoie les champs selon le type
    if(data.type === 'COURANT') data.tauxInteret = 0;
    else data.decouvert = 0;

    this.compteService.createAccount(data).subscribe({
      next: () => {
        Swal.fire('Succès', 'Le compte a été ouvert avec succès !', 'success');
        this.router.navigateByUrl(`/admin/client-details/${this.clientId}`);
      },
      error: (err) => Swal.fire('Erreur', 'Impossible d\'ouvrir le compte', 'error')
    });
  }
}
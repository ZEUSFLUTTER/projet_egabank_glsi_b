import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ServiceAuthentification } from '../../services/service-authentification.service';
import { ClientModele } from '../../modeles/client-modele';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout-principal',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-principal.component.html',
  styleUrls: ['./layout-principal.component.css']
})
export class LayoutPrincipalComponent implements OnInit {
  client: ClientModele | null = null;
  menuOuvert = false;

  constructor(
    private serviceAuth: ServiceAuthentification,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.client = this.serviceAuth.obtenirClientConnecte();
    
    this.serviceAuth.clientConnecte$.subscribe(client => {
      this.client = client;
    });
  }

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  fermerMenu(): void {
    this.menuOuvert = false;
  }

  deconnecter(): void {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceAuth.deconnecter();
        this.router.navigate(['/connexion']);
        Swal.fire({
          icon: 'success',
          title: 'Déconnecté',
          text: 'Vous avez été déconnecté avec succès',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
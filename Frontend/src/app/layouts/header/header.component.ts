import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockageJeton } from '../../coeur/stockage-jeton';
import { ServiceAuthentification } from '../../services/service-authentification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  nomUtilisateur = '';

  constructor(
    private routeur: Router,
    private authService: ServiceAuthentification
  ) {}

  ngOnInit(): void {
    this.nomUtilisateur = StockageJeton.lireNomUtilisateur();
  }

  seDeconnecter(): void {
    this.authService.deconnexion(); 
    this.routeur.navigate(['/connexion']);
  }
}

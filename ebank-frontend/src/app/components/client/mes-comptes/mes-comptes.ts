import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mes-comptes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mes-comptes.html',
  styleUrl: './mes-comptes.scss'
})
export class MesComptesComponent implements OnInit {
  myAccounts: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {} 

  ngOnInit(): void {
    this.loadMyData();
  }

  loadMyData() {
    this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe({
      next: (data) => {
        this.myAccounts = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Erreur chargement mes-comptes", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
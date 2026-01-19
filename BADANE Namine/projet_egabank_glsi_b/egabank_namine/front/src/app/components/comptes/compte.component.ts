import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compte',
  
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {
  comptes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.clientId) {
      this.apiService.getComptes(user.clientId).subscribe({
        next: (data) => this.comptes = data,
        error: (err) => console.error(err)
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profil: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.apiService.getProfile(user.username).subscribe({
      next: (data) => this.profil = data,
      error: (err) => console.error(err)
    });
  }
}
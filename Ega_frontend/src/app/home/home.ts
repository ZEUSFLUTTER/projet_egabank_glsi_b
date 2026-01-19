import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Nécessaire pour les liens vers Login/Register
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private router: Router) {}

  onLogin() {
    console.log("Navigation vers le dashboard en cours...");

    // On utilise navigate (avec un tableau) qui est plus robuste que navigateByUrl
    this.router.navigate(['/dashboard']).then(success => {
      if (success) {
        console.log("Redirection réussie !");
      } else {
        console.error("La redirection a échoué. Vérifiez vos routes.");
      }
    });
  }
}

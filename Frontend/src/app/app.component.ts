import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="container">
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'EgaBank';
}

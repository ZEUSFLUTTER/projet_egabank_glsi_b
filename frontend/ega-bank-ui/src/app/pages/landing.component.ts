import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container" id="home">
      <nav class="navbar">
        <div class="nav-content">
          <div class="logo">
            <img src="assets/logo.png" alt="EGA BANQUE" class="logo-img">
          </div>
          <div class="nav-links">
            <a href="#home">Accueil</a>
            <a href="#features">Services</a>
            <a href="#about">À Propos</a>
            <a href="#contact">Contact</a>
            <button (click)="goToLogin()" class="btn-primary">Se Connecter</button>
          </div>
        </div>
      </nav>

      <main>
        <section class="hero">
          <div class="hero-content">
            <h1>Gérez vos finances avec <span class="highlight">EGA BANQUE</span></h1>
            <p>Une expérience bancaire moderne, sécurisée et intuitive pour tous vos besoins quotidiens.</p>
            <div class="hero-actions">
              <button (click)="goToRegister()" class="btn-large">Commencer Maintenant</button>
            </div>
          </div>
        </section>

        <section id="features" class="features">
          <div class="section-header">
            <h2>Nos Services</h2>
            <div class="divider"></div>
          </div>
          <div class="grid">
            <div class="card">
              <i class="ri-bank-line icon"></i>
              <h3>Gestion de Comptes</h3>
              <p>Suivez vos soldes et opérations en temps réel avec une clarté totale.</p>
            </div>
            <div class="card">
              <i class="ri-exchange-funds-line icon"></i>
              <h3>Virements Instantanés</h3>
              <p>Envoyez de l'argent en toute sécurité à vos proches ou partenaires.</p>
            </div>
            <div class="card">
              <i class="ri-shield-check-line icon"></i>
              <h3>Sécurité Maximale</h3>
              <p>Vos données sont protégées par les protocoles de sécurité les plus avancés.</p>
            </div>
          </div>
        </section>

        <section id="about" class="about" style="padding: 100px 5%; background: var(--light);">
          <div class="section-header">
            <h2>À Propos de Nous</h2>
            <div class="divider"></div>
          </div>
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <p style="font-size: 1.125rem; line-height: 1.8; color: var(--text);">
              EGA BANQUE est une institution financière moderne dédiée à fournir des solutions bancaires innovantes et accessibles. 
              Notre plateforme numérique vous permet de gérer vos finances avec une simplicité et une sécurité inégalées.
            </p>
          </div>
        </section>

        <section id="contact" class="contact" style="padding: 100px 5%; background: var(--white);">
           <div class="section-header">
            <h2>Contactez-nous</h2>
            <div class="divider"></div>
          </div>
          <div style="max-width: 600px; margin: 0 auto;">
             <form style="display: flex; flex-direction: column; gap: 20px;">
                <input type="text" placeholder="Nom complet" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                <input type="email" placeholder="Email" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                <textarea placeholder="Votre message" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; height: 120px;"></textarea>
                <button type="submit" class="btn-primary" style="align-self: flex-start;">Envoyer le message</button>
             </form>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <div class="logo" style="justify-content: center; margin-bottom: 10px;">
            <img src="assets/logo.png" alt="EGA BANQUE" class="logo-img" style="filter: brightness(0) invert(1);">
          </div>
          <p>&copy; 2026 EGA BANQUE. Tous droits réservés.</p>
          <div class="social-links">
             <i class="ri-facebook-fill"></i>
             <i class="ri-twitter-fill"></i>
             <i class="ri-linkedin-fill"></i>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      --primary: #FF8D28;
      --secondary: #084506;
      --accent: #FFCC00;
      --text: #333;
      --light: #F6F8F7;
      --white: #FFFFFF;
    }

    .landing-container {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: var(--text);
      background-color: var(--white);
    }

    .navbar {
      height: 80px;
      display: flex;
      align-items: center;
      padding: 0 5%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .nav-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-img {
      height: 40px;
      width: auto;
    }

    .brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--secondary);
      letter-spacing: -0.5px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text);
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: var(--primary);
    }

    .btn-primary {
      background: var(--primary);
      color: var(--white);
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      background: #e67e1a;
    }

    .hero {
      padding: 100px 5%;
      background: linear-gradient(135deg, var(--accent) 0%, #FFF5CC 100%);
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--secondary);
      margin-bottom: 24px;
      line-height: 1.1;
    }

    .hero-content p {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto 40px;
      opacity: 0.9;
    }

    .highlight {
      color: var(--primary);
      position: relative;
    }

    .btn-large {
      background: var(--secondary);
      color: var(--white);
      border: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(8, 69, 6, 0.2);
    }

    .btn-large:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(8, 69, 6, 0.3);
    }

    .features {
      padding: 100px 5%;
      background: var(--white);
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      color: var(--secondary);
      margin-bottom: 16px;
    }

    .divider {
      width: 60px;
      height: 4px;
      background: var(--primary);
      margin: 0 auto;
      border-radius: 2px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .card {
      padding: 40px;
      background: var(--white);
      border-radius: 20px;
      border: 1px solid #eee;
      transition: all 0.3s ease;
      text-align: center;
    }

    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      border-color: var(--primary);
    }

    .icon {
      font-size: 3rem;
      color: var(--primary);
      margin-bottom: 20px;
      display: block;
    }

    .card h3 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      color: var(--secondary);
    }

    .footer {
      padding: 60px 5%;
      background: var(--secondary);
      color: var(--white);
      text-align: center;
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .social-links {
      display: flex;
      gap: 20px;
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .hero-content h1 { font-size: 2.5rem; }
      .nav-links a { display: none; }
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

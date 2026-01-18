import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="logo-section">
            <img src="/assets/logo.jpeg" alt="EGA Bank Logo" class="logo" />
            <h1 class="bank-name">EGA Bank</h1>
          </div>
          <nav class="nav">
            <button class="btn-login" (click)="navigateToLogin()">Connexion</button>
            <button class="btn-register" (click)="navigateToRegister()">Inscription</button>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Votre partenaire bancaire de confiance</h1>
            <p class="hero-subtitle">
              EGA Bank vous offre des solutions bancaires modernes et sécurisées pour gérer vos
              finances en toute simplicité.
            </p>
            <div class="hero-buttons">
              <button class="btn-primary" (click)="navigateToRegister()">Ouvrir un compte</button>
              <button class="btn-secondary" (click)="scrollToServices()">
                Découvrir nos services
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="services" id="services">
        <div class="container">
          <h2 class="section-title">Nos Services</h2>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">💳</div>
              <h3>Comptes Bancaires</h3>
              <p>Ouvrez et gérez vos comptes courants et épargne en quelques clics.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">💸</div>
              <h3>Transactions</h3>
              <p>Effectuez vos virements, dépôts et retraits en toute sécurité.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">📊</div>
              <h3>Suivi en temps réel</h3>
              <p>Consultez vos soldes et l'historique de vos transactions à tout moment.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🔒</div>
              <h3>Sécurité maximale</h3>
              <p>Vos données sont protégées par les dernières technologies de sécurité.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">👥</div>
              <h3>Gestion des clients</h3>
              <p>Interface intuitive pour gérer les informations de vos clients.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">📱</div>
              <h3>Application moderne</h3>
              <p>Accédez à vos comptes depuis n'importe quel appareil.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">Pourquoi choisir EGA Bank ?</h2>
          <div class="features-grid">
            <div class="feature">
              <h3>✨ Interface intuitive</h3>
              <p>Une expérience utilisateur simple et agréable pour tous vos besoins bancaires.</p>
            </div>
            <div class="feature">
              <h3>⚡ Rapidité</h3>
              <p>Transactions instantanées et traitement rapide de vos demandes.</p>
            </div>
            <div class="feature">
              <h3>🛡️ Fiabilité</h3>
              <p>Une infrastructure robuste pour garantir la disponibilité de nos services.</p>
            </div>
            <div class="feature">
              <h3>🌍 Accessibilité</h3>
              <p>Accédez à vos comptes 24/7 depuis n'importe où dans le monde.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez EGA Bank dès aujourd'hui et profitez d'une expérience bancaire moderne.</p>
          <button class="btn-primary" (click)="navigateToRegister()">Créer un compte</button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h4>EGA Bank</h4>
              <p>Votre partenaire bancaire de confiance depuis 2026.</p>
            </div>
            <div class="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Comptes bancaires</li>
                <li>Transactions</li>
                <li>Gestion de clients</li>
                <li>Rapports financiers</li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>Email: contact@egabank.com</li>
                <li>Tél: +228 XX XX XX XX</li>
                <li>Adresse: Lomé, Togo</li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 EGA Bank. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing-page {
        width: 100%;
        overflow-x: hidden;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      /* Header */
      .header {
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo {
        height: 50px;
        width: auto;
      }

      .bank-name {
        font-size: 1.5rem;
        font-weight: bold;
        color: #1e40af;
        margin: 0;
      }

      .nav {
        display: flex;
        gap: 1rem;
      }

      .btn-login,
      .btn-register {
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-login {
        background: transparent;
        color: #1e40af;
        border: 2px solid #1e40af;
      }

      .btn-login:hover {
        background: #1e40af;
        color: white;
      }

      .btn-register {
        background: #1e40af;
        color: white;
      }

      .btn-register:hover {
        background: #1e3a8a;
      }

      /* Hero Section */
      .hero {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
        padding: 6rem 0;
        text-align: center;
      }

      .hero-title {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        font-weight: bold;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.95;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-primary,
      .btn-secondary {
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
      }

      .btn-primary {
        background: white;
        color: #1e40af;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }

      .btn-secondary:hover {
        background: white;
        color: #1e40af;
      }

      /* Services Section */
      .services {
        padding: 4rem 0;
        background: #f9fafb;
      }

      .section-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: #1e40af;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .service-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        text-align: center;
      }

      .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      .service-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .service-card h3 {
        color: #1e40af;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      .service-card p {
        color: #6b7280;
        line-height: 1.6;
      }

      /* Features Section */
      .features {
        padding: 4rem 0;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .feature {
        padding: 1.5rem;
      }

      .feature h3 {
        color: #1e40af;
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
      }

      .feature p {
        color: #6b7280;
        line-height: 1.6;
      }

      /* CTA Section */
      .cta {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
      }

      .cta h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .cta p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
      }

      /* Footer */
      .footer {
        background: #1f2937;
        color: white;
        padding: 3rem 0 1rem;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .footer-section h4 {
        margin-bottom: 1rem;
        color: #3b82f6;
      }

      .footer-section ul {
        list-style: none;
        padding: 0;
      }

      .footer-section li {
        margin-bottom: 0.5rem;
        color: #d1d5db;
      }

      .footer-bottom {
        border-top: 1px solid #374151;
        padding-top: 1rem;
        text-align: center;
        color: #9ca3af;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-title {
          font-size: 2rem;
        }

        .section-title {
          font-size: 2rem;
        }

        .services-grid,
        .features-grid {
          grid-template-columns: 1fr;
        }

        .nav {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

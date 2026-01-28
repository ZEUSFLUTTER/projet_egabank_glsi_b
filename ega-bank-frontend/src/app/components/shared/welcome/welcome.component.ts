import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="logo-section">
            <div class="logo">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="url(#gradient1)"/>
                <path d="M30 40h40v20H30z" fill="white" opacity="0.9"/>
                <path d="M35 35h30v5H35z" fill="white" opacity="0.7"/>
                <path d="M35 65h30v5H35z" fill="white" opacity="0.7"/>
                <circle cx="60" cy="50" r="3" fill="white"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea"/>
                    <stop offset="100%" style="stop-color:#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="brand-name">EGA Bank</h1>
          </div>
          
          <h2 class="hero-title">Votre banque digitale nouvelle génération</h2>
          <p class="hero-subtitle">
            Découvrez une expérience bancaire révolutionnaire avec notre plateforme 
            <span class="highlight">intelligente</span> et <span class="highlight">sécurisée</span>. 
            Gérez vos finances en toute simplicité, où que vous soyez.
          </p>
          
          <div class="cta-buttons">
            <button class="btn btn-primary" (click)="goToClientLogin()">
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Espace Client
            </button>
            <button class="btn btn-secondary" (click)="goToAdminLogin()">
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              Administration
            </button>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="card card-1">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Cartes</span>
            </div>
            <div class="card card-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
              <span>Virements</span>
            </div>
            <div class="card card-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <span>Statistiques</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <div class="container">
          <h3 class="section-title">Pourquoi choisir EGA Bank ?</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h4>Sécurité maximale</h4>
              <p>Vos données sont protégées par un chiffrement de niveau bancaire et une authentification à deux facteurs.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <h4>Disponible 24h/24</h4>
              <p>Accédez à vos comptes et effectuez vos opérations bancaires à tout moment, où que vous soyez.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <h4>Transactions rapides</h4>
              <p>Virements instantanés, paiements en temps réel et notifications immédiates pour tous vos mouvements.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h4>Service premium</h4>
              <p>Une équipe dédiée à votre service avec un support client réactif et des conseils personnalisés.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Clients satisfaits</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Disponibilité</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Support client</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Sécurisé</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="url(#gradient2)"/>
                  <path d="M30 40h40v20H30z" fill="white" opacity="0.9"/>
                  <path d="M35 35h30v5H35z" fill="white" opacity="0.7"/>
                  <path d="M35 65h30v5H35z" fill="white" opacity="0.7"/>
                  <circle cx="60" cy="50" r="3" fill="white"/>
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#667eea"/>
                      <stop offset="100%" style="stop-color:#764ba2"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>EGA Bank</span>
              </div>
              <p>Votre partenaire financier de confiance</p>
            </div>
            <div class="footer-links">
              <div class="link-group">
                <h5>Services</h5>
                <a href="#">Comptes</a>
                <a href="#">Cartes</a>
                <a href="#">Prêts</a>
                <a href="#">Épargne</a>
              </div>
              <div class="link-group">
                <h5>Support</h5>
                <a href="#">Centre d'aide</a>
                <a href="#">Contact</a>
                <a href="#">FAQ</a>
                <a href="#">Sécurité</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 EGA Bank. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .welcome-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      overflow-x: hidden;
      position: relative;
    }

    .welcome-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%);
      animation: gradientShift 20s ease infinite;
    }

    .welcome-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 100px 100px, 150px 150px, 200px 200px;
      background-position: 0 0, 50px 50px, 100px 100px;
      animation: particleFloat 30s linear infinite;
      pointer-events: none;
    }

    @keyframes particleFloat {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-100vh) rotate(360deg); }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5%;
      position: relative;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
      z-index: 2;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;
    }

    .logo {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .brand-name {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
      background: linear-gradient(45deg, #fff, #e0e0e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 40px;
      opacity: 0.9;
      max-width: 500px;
    }

    .highlight {
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      position: relative;
    }

    .highlight::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      border-radius: 1px;
      animation: highlightPulse 2s ease-in-out infinite;
    }

    @keyframes highlightPulse {
      0%, 100% { opacity: 0.5; transform: scaleX(1); }
      50% { opacity: 1; transform: scaleX(1.05); }
    }

    .cta-buttons {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-icon {
      transition: transform 0.3s ease;
    }

    .btn:hover .btn-icon {
      transform: scale(1.1);
    }

    /* Hero Visual */
    .hero-visual {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .floating-cards {
      position: relative;
      width: 400px;
      height: 400px;
    }

    .card {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: white;
      font-weight: 600;
      animation: float 6s ease-in-out infinite, cardGlow 4s ease-in-out infinite;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: scale(1.05) translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    @keyframes cardGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
      50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
    }

    .card-1 {
      top: 0;
      left: 0;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50px;
      right: 0;
      animation-delay: 2s;
    }

    .card-3 {
      bottom: 0;
      left: 50px;
      animation-delay: 4s;
    }

    /* Features Section */
    .features-section {
      padding: 100px 0;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 60px;
      color: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 40px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 40px 30px;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s;
    }

    .feature-card:hover::before {
      left: 100%;
    }

    .feature-card:hover {
      transform: translateY(-15px) scale(1.02);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .feature-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      color: #fff;
    }

    .feature-card h4 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: white;
    }

    .feature-card p {
      line-height: 1.6;
      opacity: 0.9;
      color: white;
    }

    /* Stats Section */
    .stats-section {
      padding: 80px 0;
      background: rgba(0, 0, 0, 0.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
    }

    .stat-item {
      text-align: center;
      padding: 30px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.15);
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin-bottom: 8px;
      background: linear-gradient(45deg, #fff, #e0e0e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: numberGlow 3s ease-in-out infinite;
    }

    @keyframes numberGlow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.8;
      color: white;
    }

    /* Footer */
    .footer {
      background: rgba(0, 0, 0, 0.2);
      padding: 60px 0 20px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-bottom: 40px;
    }

    .footer-brand {
      max-width: 400px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .footer-brand p {
      opacity: 0.8;
      line-height: 1.6;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }

    .link-group h5 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: white;
    }

    .link-group a {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      margin-bottom: 8px;
      transition: color 0.3s ease;
    }

    .link-group a:hover {
      color: white;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
      text-align: center;
      opacity: 0.6;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 40px 20px;
      }

      .hero-content {
        margin-bottom: 60px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .brand-name {
        font-size: 2rem;
      }

      .cta-buttons {
        justify-content: center;
      }

      .floating-cards {
        width: 300px;
        height: 300px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .footer-links {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }

      .btn {
        padding: 14px 24px;
        font-size: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WelcomeComponent {

  constructor(private router: Router) {}

  goToClientLogin() {
    this.router.navigate(['/login']);
  }

  goToAdminLogin() {
    this.router.navigate(['/login']);
  }
}
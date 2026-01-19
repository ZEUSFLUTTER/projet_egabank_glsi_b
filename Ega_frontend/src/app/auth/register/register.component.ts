import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';
import { Country, City, ICountry, ICity } from 'country-state-city';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styles: [`
    .fade-in { animation: fadeIn 0.5s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    select { background-image: none; }
  `]
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  step = 1;
  isLoading = false;

  formData = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    sexe: '',
    nationalite: '',
    paysResidence: '',
    ville: '',
    indicatif: '+228',
    telephone: '',
    email: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  };

  allCountries: ICountry[] = [];
  villesDisponibles: ICity[] = [];

  ngOnInit() {
    this.allCountries = Country.getAllCountries();
    this.allCountries.sort((a, b) => a.name.localeCompare(b.name));
  }

  onPaysChange() {
    const selectedCountry = this.allCountries.find(c => c.name === this.formData.paysResidence);
    if (selectedCountry) {
      this.villesDisponibles = City.getCitiesOfCountry(selectedCountry.isoCode) || [];
      if (!this.formData.telephone) {
        this.formData.indicatif = `+${selectedCountry.phonecode}`;
      }
    } else {
      this.villesDisponibles = [];
    }
    this.formData.ville = '';
  }

  // --- 1. BLOQUER LA SAISIE EN TEMPS RÉEL (Pour le Nom et Prénom) ---
  onlyLetters(event: any) {
    // Cette regex autorise : Lettres (a-z), Accents (À-ÿ), Espaces (\s) et Trait d'union (-)
    const pattern = /[a-zA-ZÀ-ÿ\s'-]/;
    const inputChar = String.fromCharCode(event.charCode);

    // Si le caractère tapé ne correspond pas au motif, on annule l'action
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // --- 2. BLOQUER LA SAISIE EN TEMPS RÉEL (Pour le Téléphone) ---
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  nextStep() {
    // --- ÉTAPE 1 : INFOS PERSO ---
    if (this.step === 1) {
       // A. Vérification champs vides
       if (!this.formData.nom || !this.formData.prenom || !this.formData.dateNaiss || !this.formData.sexe) {
         this.showWarning('Veuillez remplir tous les champs personnels.');
         return;
       }

       // B. VÉRIFICATION CARACTÈRES SPÉCIAUX (NOM & PRÉNOM) - ✅ AJOUTÉ ICI
       // Regex stricte : Lettres, Accents, Espaces, Tirets uniquement.
       // ^ = début, $ = fin. Si un autre caractère est trouvé, ça renvoie false.
       const nameRegex = /[a-zA-ZÀ-ÿ\s'-]/;

       if (!nameRegex.test(this.formData.nom) || !nameRegex.test(this.formData.prenom)) {
         this.showWarning("Le nom et le prénom ne doivent pas contenir de caractères spéciaux (sauf trait d'union).");
         return;
       }

       // C. Vérification Majorité (18 ans)
       const birthDate = new Date(this.formData.dateNaiss);
       const today = new Date();
       let age = today.getFullYear() - birthDate.getFullYear();
       const monthDiff = today.getMonth() - birthDate.getMonth();
       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
           age--;
       }
       if (age < 17) {
           this.showWarning("Vous devez avoir au moins 17 ans pour ouvrir un compte.");
           return;
       }

    // --- ÉTAPE 2 : COORDONNÉES ---
    } else if (this.step === 2) {
       if (!this.formData.nationalite || !this.formData.telephone || !this.formData.email || !this.formData.paysResidence || !this.formData.ville) {
         this.showWarning('Veuillez remplir vos coordonnées.');
         return;
       }

       const phoneRegex = /^\d+$/;
       if (!phoneRegex.test(this.formData.telephone)) {
         this.showWarning('Le numéro de téléphone doit contenir uniquement des chiffres.');
         return;
       }
    }
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {
    if (this.formData.password !== this.formData.confirmPassword) {
      Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }

    this.isLoading = true;

    const cleanPhone = `${this.formData.indicatif}${this.formData.telephone}`;
    const finalAddress = `${this.formData.ville}, ${this.formData.paysResidence}`;

    const registerDto = {
        ...this.formData,
        telephone: cleanPhone,
        adresse: finalAddress
    };

    this.authService.register(registerDto).subscribe({
      next: () => {
        const loginData = {
          username: this.formData.email,
          password: this.formData.password
        };

        this.authService.login(loginData).subscribe({
          next: (user) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Bienvenue !',
              text: 'Compte créé avec succès. Accès à votre espace...',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              if (user.role === 'ROLE_ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/client']);
              }
            });
          },
          error: (loginErr) => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || "Erreur lors de l'inscription";
        Swal.fire('Erreur', msg, 'error');
      }
    });
  }

  private showWarning(msg: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: msg,
      confirmButtonColor: '#9308C8'
    });
  }
}

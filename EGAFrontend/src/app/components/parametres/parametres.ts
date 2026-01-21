import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GesadminService } from '../../services/gesadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, User, Lock, Save, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-parametres',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './parametres.html',
  styleUrl: './parametres.css',
})
export class Parametres {
  readonly User = User;
  readonly Lock = Lock;
  readonly Save = Save;

  private fb = inject(FormBuilder);
  private adminService = inject(GesadminService);
  private snack = inject(MatSnackBar);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit(): void {
      this.initForms();
      this.loadUserData();
  }

  initForms() {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
       ? null : {'mismatch': true};
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.adminService.updateSelf(this.profileForm.value).subscribe({
        next: () => this.snack.open("Profil mis à jour !", "OK", { duration: 3000 }),
        error: () => this.snack.open("Erreur de mise à jour", "X", { duration: 3000 })
      });
    }
  }

  updatePassword() {
    this.adminService.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.snack.open(res, "Succès", { duration: 3000 });
        this.passwordForm.reset();
      },
      error: (err) => {
        const message = err.error || "Une erreur est survenue";
        this.snack.open(message, "X", { duration: 3000 });
      }
    });
  }

  loadUserData() {
    const savedUser = localStorage.getItem('auth-user'); 
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.profileForm.patchValue({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        numero: userData.numero
      });
    }
  }
}
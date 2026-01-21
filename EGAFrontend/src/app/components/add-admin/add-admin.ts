import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GesadminService } from '../../services/gesadmin.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, UserPlus, Save, ChevronLeft } from 'lucide-angular';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './add-admin.html'
})
export class AddAdmin implements OnInit {
  readonly UserPlus = UserPlus;
  readonly Save = Save;
  readonly ChevronLeft = ChevronLeft;

  private fb = inject(FormBuilder);
  private adminService = inject(GesadminService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', [Validators.required]],
      role: ['ADMIN', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.adminService.createAdmin(this.form.value).subscribe({
        next: (response) => {
          this.snack.open(response, 'Succès', { duration: 3000 });
          this.router.navigate(['/administrateur']);
        },
        error: (err) => {
          this.snack.open("Erreur lors de la création de l'administrateur", 'X', { duration: 3000 });
        }
      });
    }
  }
}
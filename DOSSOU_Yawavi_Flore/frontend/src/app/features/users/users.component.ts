import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User, CreateUserDto } from '../../shared/models/user.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { 
  faUserPlus, faCheck, faTimes, faEdit, faTrash, 
  faSearch, faFilter 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FaIconComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  showCreateModal = false;
  userForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  selectedUserType: 'gestionnaire' | 'caissiere' = 'gestionnaire';
  filterStatus: 'active' | 'inactive' = 'active';
  searchTerm = '';

  // Icons
  faUserPlus = faUserPlus;
  faCheck = faCheck;
  faTimes = faTimes;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faFilter = faFilter;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    const service = this.filterStatus === 'active' 
      ? this.userService.getAllActiveUsers()
      : this.userService.getAllInactiveUsers();

    service.subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.loadUsers();
  }

  openCreateModal(userType: 'gestionnaire' | 'caissiere'): void {
    this.selectedUserType = userType;
    this.showCreateModal = true;
    this.userForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData: CreateUserDto = this.userForm.value;

      const service = this.selectedUserType === 'gestionnaire'
        ? this.userService.createGestionnaire(userData)
        : this.userService.createCaissiere(userData);

      service.subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          this.userForm.reset();
          setTimeout(() => {
            this.closeCreateModal();
            this.loadUsers();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    const service = user.isActive
      ? this.userService.deactivateUser(user.matricule)
      : this.userService.activateUser(user.matricule);

    service.subscribe({
      next: (response) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = '';
          this.loadUsers();
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'opération';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}

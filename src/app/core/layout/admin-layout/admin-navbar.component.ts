import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-navbar',
    standalone: true,
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm px-4">
      <div class="container-fluid">
        <button type="button" class="btn btn-light d-md-none me-2">
          <i class="bi bi-list"></i>
        </button>
        <div class="search-box d-none d-md-block">
          <div class="input-group">
            <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control bg-light border-0" placeholder="Search...">
          </div>
        </div>
        <div class="ms-auto d-flex align-items-center">
          <div class="dropdown me-3">
            <button class="btn btn-light position-relative rounded-circle p-2">
              <i class="bi bi-bell"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
            </button>
          </div>
          <div class="d-flex align-items-center">
            <div class="text-end me-2 d-none d-sm-block">
              <div class="fw-bold small">Admin User</div>
              <div class="text-muted extra-small">Super Admin</div>
            </div>
            <img src="https://i.pravatar.cc/35?u=admin" class="rounded-circle border" alt="Profile">
          </div>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .extra-small { font-size: 0.75rem; }
    .search-box .form-control:focus { box-shadow: none; background-color: #f1f3f5; }
  `]
})
export class AdminNavbarComponent { }

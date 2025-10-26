import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-2 mb-3">
      <div class="d-flex justify-content-center">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-outline-primary btn-sm" (click)="goToCustomerView()">
            <i class="fas fa-user me-1"></i>Customer View
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="goToAdminView()">
            <i class="fas fa-cog me-1"></i>Shipments
          </button>
          <button type="button" class="btn btn-outline-info btn-sm" (click)="goToEmployeeManagement()">
            <i class="fas fa-users me-1"></i>Employees
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminNavComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToCustomerView() {
    this.router.navigate(['/dashboard']);
  }

  goToAdminView() {
    this.router.navigate(['/admin/shipments']);
  }

  goToEmployeeManagement() {
    this.router.navigate(['/admin/employees']);
  }
}
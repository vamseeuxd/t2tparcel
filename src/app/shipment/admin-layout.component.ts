import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';
import { AdminShipmentsComponent } from './admin-shipments.component';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, AdminShipmentsComponent, AdminNavComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container-fluid">
        <span class="navbar-brand fw-bold">Table to Table - Admin</span>
        <div class="d-flex">
          <button class="btn btn-outline-light btn-sm me-2" (click)="toggleTheme()">
            <i class="fa-solid fa-moon"></i>
          </button>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">
            <i class="fas fa-user"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    <div style="padding-top: 80px;">
      <app-admin-nav></app-admin-nav>
      <app-admin-shipments></app-admin-shipments>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
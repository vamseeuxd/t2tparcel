import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';
import { AdminShipmentsComponent } from './admin-shipments.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, AdminShipmentsComponent],
  template: ` <app-admin-shipments></app-admin-shipments> `,
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

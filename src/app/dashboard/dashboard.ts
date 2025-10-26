import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  parcels = [
    { id: 'IND001', destination: 'New York', status: 'In Transit', type: 'International' },
    { id: 'DOM002', destination: 'Mumbai', status: 'Delivered', type: 'Domestic' },
    { id: 'IND003', destination: 'London', status: 'Processing', type: 'International' }
  ];

  constructor(public themeService: ThemeService, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

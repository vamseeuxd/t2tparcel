import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme';

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

  constructor(private router: Router, public themeService: ThemeService) {}

  logout(): void {
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

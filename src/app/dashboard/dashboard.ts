import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';
import { ShipmentListComponent } from '../shipment/shipment-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ShipmentListComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  constructor(public themeService: ThemeService, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { ThemeService } from './services/theme';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkActive, RouterLinkWithHref, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(
    public themeService: ThemeService,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Theme service initializes automatically
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  goToCustomerView() {
    this.router.navigate(['/dashboard']);
  }

  goToAdminView() {
    this.router.navigate(['/admin/shipments']);
  }

  goToEmployeeManagement() {
    this.router.navigate(['/admin/employees']);
  }

  goToIncome() {
    this.router.navigate(['/admin/income']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, public themeService: ThemeService) {}

  onLogin(): void {
    if (this.username && this.password) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

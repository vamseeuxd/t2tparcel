import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';
  isSignup = false;
  showResetPassword = false;

  constructor(public themeService: ThemeService, private authService: AuthService) {}

  async onSubmit(): Promise<void> {
    try {
      this.error = '';
      this.success = '';
      if (this.isSignup) {
        await this.authService.registerWithEmail(this.email, this.password);
      } else {
        await this.authService.loginWithEmail(this.email, this.password);
      }
    } catch (error: any) {
      if (error.message.includes('Registration successful')) {
        this.success = error.message;
        this.isSignup = false;
      } else {
        this.error = error.message;
      }
    }
  }

  async onGoogleLogin(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async onResetPassword(): Promise<void> {
    try {
      this.error = '';
      this.success = '';
      await this.authService.resetPassword(this.email);
    } catch (error: any) {
      if (error.message.includes('Password reset email sent')) {
        this.success = error.message;
        this.showResetPassword = false;
      } else {
        this.error = error.message;
      }
    }
  }

  toggleMode(): void {
    this.isSignup = !this.isSignup;
    this.showResetPassword = false;
    this.error = '';
    this.success = '';
  }

  toggleResetPassword(): void {
    this.showResetPassword = !this.showResetPassword;
    this.error = '';
    this.success = '';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

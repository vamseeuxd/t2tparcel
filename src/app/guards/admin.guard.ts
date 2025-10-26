import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = await this.userService.getUserByEmail(currentUser.email!);
    
    if (user?.role !== 'admin') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
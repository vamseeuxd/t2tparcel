import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, sendEmailVerification, sendPasswordResetEmail, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      if (result.user.emailVerified) {
        this.router.navigate(['/dashboard']);
      } else {
        throw new Error('Please verify your email before logging in');
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async registerWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(result.user);
      throw new Error('Registration successful! Please check your email (including spam/junk folder) to verify your account before logging in.');
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      throw new Error('Password reset email sent! Please check your email (including spam/junk folder).');
    } catch (error: any) {
      if (error.message.includes('Password reset email sent')) {
        throw error;
      }
      throw new Error(this.getErrorMessage(error));
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

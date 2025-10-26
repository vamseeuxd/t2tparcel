import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.setTheme(isDark);
  }

  toggleTheme(): void {
    this.setTheme(!this.isDarkTheme.value);
  }

  setTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Remove existing theme classes
    document.body.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }
}

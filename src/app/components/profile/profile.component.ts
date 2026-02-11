import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  phone = '';
  jobTitle = '';
  bio = '';
  currentPassword = '';
  newPassword = '';
  
  isSaving = signal(false);
  saveSuccess = signal(false);
  saveError = signal('');

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      this.name = user.name || '';
      this.email = user.email || '';
    }
  }

  userName(): string {
    return this.authService.currentUser()?.name || 'User';
  }

  userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  getUserInitial(): string {
    return this.userName().charAt(0).toUpperCase();
  }

  saveProfile(): void {
    this.isSaving.set(true);
    this.saveError.set('');
    this.saveSuccess.set(false);
    
    // Simulate save
    setTimeout(() => {
      this.isSaving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    }, 800);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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
    alert('Profile saved successfully!');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

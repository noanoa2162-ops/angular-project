import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Notification settings
  emailNotifications = true;
  pushNotifications = true;
  taskReminders = true;

  // Appearance settings
  theme: 'light' | 'dark' | 'system' = 'light';
  compactMode = false;

  // Security settings
  twoFactorAuth = false;
  activityStatus = true;

  saveSettings(): void {
    alert('Settings saved successfully!');
  }

  exportData(): void {
    alert('Your data export will be ready soon!');
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.logout();
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

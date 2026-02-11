import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  isSaving = signal(false);
  saveSuccess = signal(false);

  saveSettings(): void {
    this.isSaving.set(true);
    
    setTimeout(() => {
      this.isSaving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    }, 800);
  }

  exportData(): void {
    // Create a simple data export
    const user = this.authService.currentUser();
    const data = {
      user: user,
      settings: {
        notifications: {
          email: this.emailNotifications,
          push: this.pushNotifications,
          reminders: this.taskReminders
        },
        appearance: {
          theme: this.theme,
          compactMode: this.compactMode
        },
        security: {
          twoFactorAuth: this.twoFactorAuth,
          activityStatus: this.activityStatus
        }
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumina-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
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

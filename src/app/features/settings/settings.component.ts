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
  template: `
    <div class="settings-page">
      <div class="settings-container">
        <!-- Header -->
        <div class="settings-header">
          <button class="btn-back" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Settings</h1>
        </div>

        <!-- Settings Sections -->
        <div class="settings-content">
          <!-- Notifications -->
          <div class="settings-card">
            <div class="card-header">
              <div class="card-icon notifications">
                <mat-icon>notifications</mat-icon>
              </div>
              <div class="card-info">
                <h3>Notifications</h3>
                <p>Manage your notification preferences</p>
              </div>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Email Notifications</span>
                  <span class="setting-desc">Receive email updates about your tasks</span>
                </div>
                <mat-slide-toggle [(ngModel)]="emailNotifications" color="primary"></mat-slide-toggle>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Push Notifications</span>
                  <span class="setting-desc">Receive push notifications in browser</span>
                </div>
                <mat-slide-toggle [(ngModel)]="pushNotifications" color="primary"></mat-slide-toggle>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Task Reminders</span>
                  <span class="setting-desc">Get reminded about upcoming deadlines</span>
                </div>
                <mat-slide-toggle [(ngModel)]="taskReminders" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </div>

          <!-- Appearance -->
          <div class="settings-card">
            <div class="card-header">
              <div class="card-icon appearance">
                <mat-icon>palette</mat-icon>
              </div>
              <div class="card-info">
                <h3>Appearance</h3>
                <p>Customize how LUMINA looks</p>
              </div>
            </div>
            <div class="card-body">
              <div class="theme-selector">
                <span class="setting-title">Theme</span>
                <div class="theme-options">
                  <button class="theme-option" [class.active]="theme === 'light'" (click)="theme = 'light'">
                    <mat-icon>light_mode</mat-icon>
                    <span>Light</span>
                  </button>
                  <button class="theme-option" [class.active]="theme === 'dark'" (click)="theme = 'dark'">
                    <mat-icon>dark_mode</mat-icon>
                    <span>Dark</span>
                  </button>
                  <button class="theme-option" [class.active]="theme === 'system'" (click)="theme = 'system'">
                    <mat-icon>devices</mat-icon>
                    <span>System</span>
                  </button>
                </div>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Compact Mode</span>
                  <span class="setting-desc">Show more content with smaller spacing</span>
                </div>
                <mat-slide-toggle [(ngModel)]="compactMode" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </div>

          <!-- Privacy & Security -->
          <div class="settings-card">
            <div class="card-header">
              <div class="card-icon security">
                <mat-icon>security</mat-icon>
              </div>
              <div class="card-info">
                <h3>Privacy & Security</h3>
                <p>Manage your privacy settings</p>
              </div>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Two-Factor Authentication</span>
                  <span class="setting-desc">Add an extra layer of security</span>
                </div>
                <mat-slide-toggle [(ngModel)]="twoFactorAuth" color="primary"></mat-slide-toggle>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-title">Activity Status</span>
                  <span class="setting-desc">Let others see when you're online</span>
                </div>
                <mat-slide-toggle [(ngModel)]="activityStatus" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="settings-card danger">
            <div class="card-header">
              <div class="card-icon danger">
                <mat-icon>warning</mat-icon>
              </div>
              <div class="card-info">
                <h3>Danger Zone</h3>
                <p>Irreversible actions</p>
              </div>
            </div>
            <div class="card-body">
              <div class="danger-actions">
                <button class="btn-danger-outline" (click)="exportData()">
                  <mat-icon>download</mat-icon>
                  Export My Data
                </button>
                <button class="btn-danger" (click)="deleteAccount()">
                  <mat-icon>delete_forever</mat-icon>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="settings-footer">
          <button class="btn-save" (click)="saveSettings()">
            <mat-icon>check</mat-icon>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      min-height: 100vh;
      background: #f8fafc;
      padding: 32px;
    }

    .settings-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .settings-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;

      .btn-back {
        width: 40px;
        height: 40px;
        border: none;
        background: white;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        transition: all 0.2s ease;

        &:hover {
          transform: translateX(-2px);
        }

        mat-icon { color: #64748b; }
      }

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);

      &.danger {
        border: 1px solid #fecaca;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      &.notifications {
        background: #e0e7ff;
        color: #4f46e5;
      }

      &.appearance {
        background: #fce7f3;
        color: #db2777;
      }

      &.security {
        background: #d1fae5;
        color: #059669;
      }

      &.danger {
        background: #fee2e2;
        color: #dc2626;
      }
    }

    .card-info {
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 14px;
        color: #64748b;
        margin: 0;
      }
    }

    .card-body {
      padding: 24px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .setting-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .setting-title {
      font-size: 15px;
      font-weight: 500;
      color: #1e293b;
    }

    .setting-desc {
      font-size: 13px;
      color: #64748b;
    }

    .theme-selector {
      margin-bottom: 20px;

      .setting-title {
        display: block;
        margin-bottom: 12px;
      }
    }

    .theme-options {
      display: flex;
      gap: 12px;
    }

    .theme-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #64748b;
      }

      span {
        font-size: 13px;
        font-weight: 500;
        color: #64748b;
      }

      &:hover {
        border-color: #a78bfa;
      }

      &.active {
        border-color: #7c3aed;
        background: #f5f3ff;

        mat-icon, span {
          color: #7c3aed;
        }
      }
    }

    .danger-actions {
      display: flex;
      gap: 12px;

      @media (max-width: 500px) {
        flex-direction: column;
      }
    }

    .btn-danger-outline {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: 1px solid #fecaca;
      background: white;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #fef2f2;
      }
    }

    .btn-danger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      background: #dc2626;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #b91c1c;
      }
    }

    .settings-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .btn-save {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border: none;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
  `]
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

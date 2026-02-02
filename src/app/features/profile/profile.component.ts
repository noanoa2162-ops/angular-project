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
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <!-- Header -->
        <div class="profile-header">
          <button class="btn-back" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Profile Settings</h1>
        </div>

        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <div class="avatar">
              {{ getUserInitial() }}
            </div>
            <button class="avatar-edit">
              <mat-icon>camera_alt</mat-icon>
            </button>
          </div>
          <div class="avatar-info">
            <h2>{{ userName() }}</h2>
            <p>{{ userEmail() }}</p>
          </div>
        </div>

        <!-- Form -->
        <div class="profile-form">
          <div class="form-section">
            <h3>
              <mat-icon>person</mat-icon>
              Personal Information
            </h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="name" placeholder="Enter your name">
              </div>
              
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="email" placeholder="Enter your email">
              </div>
              
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" [(ngModel)]="phone" placeholder="+1 (555) 000-0000">
              </div>
              
              <div class="form-group">
                <label>Job Title</label>
                <input type="text" [(ngModel)]="jobTitle" placeholder="e.g. Product Manager">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>
              <mat-icon>info</mat-icon>
              Bio
            </h3>
            <div class="form-group full">
              <label>About You</label>
              <textarea [(ngModel)]="bio" rows="4" placeholder="Tell us a bit about yourself..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>
              <mat-icon>lock</mat-icon>
              Change Password
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Current Password</label>
                <input type="password" [(ngModel)]="currentPassword" placeholder="••••••••">
              </div>
              
              <div class="form-group">
                <label>New Password</label>
                <input type="password" [(ngModel)]="newPassword" placeholder="••••••••">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-cancel" (click)="goBack()">Cancel</button>
            <button class="btn-save" (click)="saveProfile()">
              <mat-icon>check</mat-icon>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background: #f8fafc;
      padding: 32px;
    }

    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        mat-icon {
          color: #64748b;
        }
      }

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
    }

    .avatar-section {
      background: white;
      border-radius: 20px;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }

    .avatar-wrapper {
      position: relative;

      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 20px;
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: 700;
        color: white;
      }

      .avatar-edit {
        position: absolute;
        bottom: -8px;
        right: -8px;
        width: 36px;
        height: 36px;
        border: 3px solid white;
        background: #7c3aed;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: white;
        }
      }
    }

    .avatar-info {
      h2 {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 15px;
        color: #64748b;
        margin: 0;
      }
    }

    .profile-form {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }

    .form-section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e2e8f0;

      &:last-of-type {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 20px 0;

        mat-icon {
          color: #7c3aed;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.full {
        grid-column: 1 / -1;
      }

      label {
        font-size: 14px;
        font-weight: 500;
        color: #64748b;
      }

      input, textarea {
        padding: 14px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 15px;
        color: #1e293b;
        transition: all 0.2s ease;
        background: #f8fafc;

        &::placeholder {
          color: #94a3b8;
        }

        &:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .btn-cancel {
      padding: 12px 24px;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
    }

    .btn-save {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      border-radius: 10px;
      font-size: 14px;
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
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
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

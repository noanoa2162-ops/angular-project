import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';

interface Notification {
  id: string;
  type: 'task' | 'team' | 'mention' | 'system';
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule, MatDividerModule, FormsModule],
  template: `
    <div class="app-layout">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="nav-left">
          <div class="logo" (click)="goToDashboard()">
            <span class="lumina-logo">
              <span class="l">L</span><span class="u">U</span><span class="m">M</span><span class="i">I</span><span class="n">N</span><span class="a">A</span>
            </span>
          </div>
          <nav class="nav-links">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              </svg>
              Dashboard
            </a>
            <a routerLink="/teams" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/>
              </svg>
              Teams
            </a>
          </nav>
        </div>
        <div class="nav-right">
          <!-- Search Bar -->
          <div class="search-bar">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search teams..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="performSearch()"
            />
            @if (searchQuery) {
              <button class="clear-search" (click)="clearSearch()">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            }
          </div>
          
          <!-- Notifications Dropdown -->
          <button class="nav-btn notification" [matMenuTriggerFor]="notifMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2"/>
            </svg>
            @if (unreadCount() > 0) {
              <span class="notification-dot">{{ unreadCount() }}</span>
            }
          </button>
          
          <mat-menu #notifMenu="matMenu" class="notif-menu-panel">
            <div class="notif-header" (click)="$event.stopPropagation()">
              <h4>Notifications</h4>
              @if (unreadCount() > 0) {
                <button class="mark-read" (click)="markAllRead()">Mark all read</button>
              }
            </div>
            <mat-divider></mat-divider>
            @for (notif of notifications(); track notif.id) {
              <button mat-menu-item class="notif-item" [class.unread]="!notif.read">
                <div class="notif-icon" [class]="notif.type">
                  <mat-icon>{{ getNotifIcon(notif.type) }}</mat-icon>
                </div>
                <div class="notif-content">
                  <span class="notif-text">{{ notif.message }}</span>
                  <span class="notif-time">{{ notif.time }}</span>
                </div>
              </button>
            }
            @if (notifications().length === 0) {
              <div class="notif-empty">
                <mat-icon>notifications_off</mat-icon>
                <p>No notifications yet</p>
              </div>
            }
          </mat-menu>
          
          <!-- User Menu Dropdown -->
          <div class="user-menu" [matMenuTriggerFor]="userMenu">
            <div class="user-avatar">
              {{ getUserInitial() }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ userName() }}</span>
              <span class="user-role">Team Member</span>
            </div>
            <button class="dropdown-btn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <mat-menu #userMenu="matMenu" class="user-menu-panel">
            <div class="menu-header" (click)="$event.stopPropagation()">
              <div class="menu-avatar">{{ getUserInitial() }}</div>
              <div class="menu-user-info">
                <span class="menu-user-name">{{ userName() }}</span>
                <span class="menu-user-email">{{ userEmail() }}</span>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/settings">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" class="logout-btn">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: #f8fafc;
    }

    .top-nav {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 48px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 0.8;
      }
    }

    .lumina-logo {
      font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
      letter-spacing: 0.12em;
      font-size: 1.4rem;
      font-weight: 800;
      text-transform: uppercase;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      span {
        display: inline-block;
      }
    }

    .nav-links {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
      text-decoration: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        color: #0f172a;
        background: #f1f5f9;
      }

      &.active {
        color: #7c3aed;
        background: rgba(124, 58, 237, 0.08);
        
        svg {
          color: #7c3aed;
        }
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s ease;
      
      svg {
        width: 20px;
        height: 20px;
        color: #64748b;
      }
      
      &:hover {
        background: #f1f5f9;
        
        svg {
          color: #0f172a;
        }
      }
      
      &.notification .notification-dot {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        border: 2px solid white;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px 6px 6px;
      border-radius: 12px;
      margin-left: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      
      &:hover {
        background: #f1f5f9;
      }
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.2;
    }
    
    .user-role {
      font-size: 12px;
      color: #94a3b8;
    }
    
    .dropdown-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 16px;
        height: 16px;
        color: #94a3b8;
      }
    }

    .main-content {
      min-height: calc(100vh - 64px);
    }
    
    /* Search Bar */
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #f1f5f9;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      margin-right: 8px;
      
      &:focus-within {
        background: white;
        border-color: #7c3aed;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
      }
      
      svg {
        width: 18px;
        height: 18px;
        color: #94a3b8;
        flex-shrink: 0;
      }
      
      input {
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        width: 180px;
        color: #1e293b;
        
        &::placeholder {
          color: #94a3b8;
        }
      }

      .clear-search {
        width: 20px;
        height: 20px;
        border: none;
        background: #e2e8f0;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;

        svg {
          width: 12px;
          height: 12px;
          color: #64748b;
        }

        &:hover {
          background: #cbd5e1;
          
          svg {
            color: #0f172a;
          }
        }
      }
    }
    
    /* Notification dot with count */
    .notification-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 16px;
      height: 16px;
      background: #ef4444;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
    
    .notification {
      position: relative;
    }
    
    /* Menu panels styles */
    ::ng-deep .notif-menu-panel {
      min-width: 320px !important;
      
      .notif-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        
        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .mark-read {
          border: none;
          background: none;
          color: #7c3aed;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .notif-item {
        display: flex !important;
        gap: 12px;
        padding: 12px 16px !important;
        
        &.unread {
          background: #f0f9ff;
        }
        
        .notif-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          
          &.task { background: #e0e7ff; color: #4f46e5; }
          &.team { background: #d1fae5; color: #059669; }
          &.mention { background: #fef3c7; color: #d97706; }
          &.system { background: #f3e8ff; color: #7c3aed; }
        }
        
        .notif-content {
          display: flex;
          flex-direction: column;
          
          .notif-text {
            font-size: 14px;
            color: #1e293b;
            line-height: 1.4;
          }
          
          .notif-time {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 2px;
          }
        }
      }
      
      .notif-empty {
        padding: 32px;
        text-align: center;
        color: #94a3b8;
        
        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          margin-bottom: 8px;
        }
        
        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
    
    ::ng-deep .user-menu-panel {
      min-width: 240px !important;
      
      .menu-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        
        .menu-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }
        
        .menu-user-info {
          display: flex;
          flex-direction: column;
          
          .menu-user-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 15px;
          }
          
          .menu-user-email {
            font-size: 13px;
            color: #64748b;
          }
        }
      }
      
      .logout-btn {
        color: #ef4444 !important;
        
        mat-icon {
          color: #ef4444;
        }
      }
    }
    
    @media (max-width: 900px) {
      .top-nav {
        padding: 0 16px;
      }
      
      .nav-links {
        display: none;
      }
      
      .user-info {
        display: none;
      }
      
      .search-bar {
        display: none;
      }
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  searchQuery = '';

  constructor() {
    // Listen to route changes and sync search query from URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Get query params from the current child route
      const childRoute = this.route.firstChild;
      if (childRoute) {
        childRoute.queryParams.subscribe(params => {
          this.searchQuery = params['search'] || '';
        });
      } else {
        this.searchQuery = '';
      }
    });
  }

  // Track which notifications have been marked as read
  private readNotificationIds = signal<Set<string>>(new Set());
  
  // Dynamic notifications based on user
  notifications = computed<Notification[]>(() => {
    const user = this.authService.currentUser();
    const userName = user?.name || 'User';
    const readIds = this.readNotificationIds();
    
    const baseNotifications = [
      { 
        id: '1', 
        type: 'system' as const, 
        message: `Welcome back, ${userName}!`, 
        time: 'Just now', 
        read: false 
      },
      { 
        id: '2', 
        type: 'task' as const, 
        message: 'You have 3 tasks pending review', 
        time: '10 min ago', 
        read: false 
      },
      { 
        id: '3', 
        type: 'team' as const, 
        message: 'Weekly team sync starts in 1 hour', 
        time: '30 min ago', 
        read: true 
      },
      { 
        id: '4', 
        type: 'mention' as const, 
        message: `Someone mentioned you in "Project Update"`, 
        time: '2 hours ago', 
        read: true 
      }
    ];
    
    return baseNotifications.map(n => ({
      ...n,
      read: n.read || readIds.has(n.id)
    }));
  });

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  userName(): string {
    const user = this.authService.currentUser();
    return user?.name || 'Guest';
  }
  
  userEmail(): string {
    const user = this.authService.currentUser();
    return user?.email || '';
  }
  
  getUserInitial(): string {
    const name = this.userName();
    return name.charAt(0).toUpperCase();
  }
  
  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      task: 'task_alt',
      team: 'groups',
      mention: 'alternate_email',
      system: 'info'
    };
    return icons[type] || 'notifications';
  }
  
  markAllRead(): void {
    const allIds = this.notifications().map(n => n.id);
    this.readNotificationIds.set(new Set(allIds));
  }
  
  performSearch(): void {
    if (this.searchQuery.trim()) {
      // Navigate to teams with search
      this.router.navigate(['/teams'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    } else {
      // If empty search, navigate to teams without query params
      this.router.navigate(['/teams']);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    // If we're on teams page, clear the search there too
    if (this.router.url.startsWith('/teams')) {
      this.router.navigate(['/teams']);
    }
  }
  
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToTeams(): void {
    this.router.navigate(['/teams']);
  }

  logout(): void {
    this.authService.logout();
  }
}

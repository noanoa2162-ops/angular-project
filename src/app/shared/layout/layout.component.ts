import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services';

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
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  searchQuery = '';

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
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

  private readNotificationIds = signal<Set<string>>(new Set());
  
  notifications = computed<Notification[]>(() => {
    const user = this.authService.currentUser();
    const userName = user?.name || 'User';
    const readIds = this.readNotificationIds();
    
    const baseNotifications = [
      { 
        id: '1', 
        type: 'system' as const, 
        message: 'Welcome back, ' + userName + '!', 
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
        message: 'Someone mentioned you in "Project Update"', 
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
      this.router.navigate(['/teams'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    } else {
      this.router.navigate(['/teams']);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
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

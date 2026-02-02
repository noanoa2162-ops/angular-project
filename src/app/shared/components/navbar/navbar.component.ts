import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services';

interface Notification {
  id: string;
  type: 'task' | 'team' | 'mention' | 'system';
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  protected authService = inject(AuthService);

  // Notifications - will be populated from server when endpoint is available
  notifications = signal<Notification[]>([]);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  });

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
    this.notifications.update(notifs => 
      notifs.map(n => ({ ...n, read: true }))
    );
  }

  onLogout(): void {
    this.authService.logout();
  }
}

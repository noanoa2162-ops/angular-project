import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { AuthService, TeamsService } from '../../../core/services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  protected teamsService = inject(TeamsService);

  isCollapsed = signal(false);
  
  currentUser = computed(() => this.authService.currentUser());
  
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  // Team colors for visual distinction
  private teamColors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

  getTeamColor(teamId: string): string {
    const index = parseInt(teamId, 10) % this.teamColors.length;
    return this.teamColors[index] || this.teamColors[0];
  }

  toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}

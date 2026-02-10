import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService, TeamsService, TasksService, ProjectsService } from '../../core/services';
import { Task, Team, Project } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private teamsService = inject(TeamsService);
  private tasksService = inject(TasksService);
  private router = inject(Router);

  // format current date for header display
  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // mock data for weekly activity chart
  weekDays = [
    { name: 'Mon', value: 65, color: 'purple' },
    { name: 'Tue', value: 45, color: 'blue' },
    { name: 'Wed', value: 80, color: 'purple' },
    { name: 'Thu', value: 55, color: 'blue' },
    { name: 'Fri', value: 90, color: 'purple' },
    { name: 'Sat', value: 30, color: 'blue' },
    { name: 'Sun', value: 20, color: 'purple' }
  ];

  // colors for team cards
  private teamColors = [
    'linear-gradient(135deg, #7C3AED, #A855F7)',
    'linear-gradient(135deg, #3B82F6, #60A5FA)',
    'linear-gradient(135deg, #10B981, #34D399)',
    'linear-gradient(135deg, #F59E0B, #FBBF24)',
    'linear-gradient(135deg, #EF4444, #F87171)'
  ];

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.name?.split(' ')[0] || 'User';
  });

  teams = computed(() => this.teamsService.teams());
  teamsCount = computed(() => this.teams().length);

  allTasks = signal<Task[]>([]);

  totalTasks = computed(() => this.allTasks().length);
  completedTasks = computed(() => this.allTasks().filter(t => t.status === 'done').length);
  pendingTasks = computed(() => this.allTasks().filter(t => t.status === 'todo' || t.status === 'in_progress').length);
  recentTasks = computed(() => this.allTasks().slice(0, 5));

  ngOnInit(): void {
    this.teamsService.loadTeams().subscribe();
    this.loadAllTasks();
  }

  private loadAllTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks.set(tasks);
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
        this.allTasks.set([]);
      }
    });
  }

  getTeamColor(teamId: string): string {
    const index = parseInt(teamId, 10) % this.teamColors.length;
    return this.teamColors[index];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}

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
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="greeting">
          <h1>Welcome back, {{ userName() }}! 👋</h1>
          <p>Here's what's happening with your tasks today</p>
        </div>
        <div class="header-actions">
          <div class="date-badge">
            <mat-icon>calendar_today</mat-icon>
            <span>{{ currentDate }}</span>
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card purple">
          <div class="stat-icon">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalTasks() }}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            <span>12%</span>
          </div>
        </div>

        <div class="stat-card blue">
          <div class="stat-icon">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ pendingTasks() }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-trend down">
            <mat-icon>trending_down</mat-icon>
            <span>5%</span>
          </div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ completedTasks() }}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            <span>23%</span>
          </div>
        </div>

        <div class="stat-card orange">
          <div class="stat-icon">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ teamsCount() }}</span>
            <span class="stat-label">Teams</span>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Recent Tasks -->
        <section class="content-card tasks-section">
          <div class="card-header">
            <h2>
              <mat-icon>task_alt</mat-icon>
              Recent Tasks
            </h2>
            <button class="view-all-btn" routerLink="/teams">View All</button>
          </div>
          <div class="tasks-list">
            @if (recentTasks().length === 0) {
              <div class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>No tasks yet</p>
                <span>Create a task from your project board</span>
              </div>
            } @else {
              @for (task of recentTasks(); track task.id) {
                <div class="task-item" [class]="'priority-' + task.priority">
                  <div class="task-status" [class]="task.status">
                    @if (task.status === 'done') {
                      <mat-icon>check_circle</mat-icon>
                    } @else if (task.status === 'in_progress') {
                      <mat-icon>schedule</mat-icon>
                    } @else {
                      <mat-icon>radio_button_unchecked</mat-icon>
                    }
                  </div>
                  <div class="task-info">
                    <span class="task-title">{{ task.title }}</span>
                    @if (task.description) {
                      <span class="task-desc">{{ task.description }}</span>
                    }
                  </div>
                  <div class="task-meta">
                    <span class="priority-badge" [class]="task.priority">{{ task.priority }}</span>
                    @if (task.due_date) {
                      <span class="due-date">
                        <mat-icon>event</mat-icon>
                        {{ formatDate(task.due_date) }}
                      </span>
                    }
                  </div>
                </div>
              }
            }
          </div>
        </section>

        <!-- Activity & Teams -->
        <div class="side-content">
          <!-- Quick Actions -->
          <section class="content-card quick-actions">
            <h2>
              <mat-icon>flash_on</mat-icon>
              Quick Actions
            </h2>
            <div class="actions-grid">
              <button class="action-item" routerLink="/teams">
                <div class="action-icon purple">
                  <mat-icon>group_add</mat-icon>
                </div>
                <span>New Team</span>
              </button>
              <button class="action-item" routerLink="/teams">
                <div class="action-icon blue">
                  <mat-icon>create_new_folder</mat-icon>
                </div>
                <span>New Project</span>
              </button>
              <button class="action-item" routerLink="/teams">
                <div class="action-icon green">
                  <mat-icon>add_task</mat-icon>
                </div>
                <span>New Task</span>
              </button>
              <button class="action-item" routerLink="/teams">
                <div class="action-icon orange">
                  <mat-icon>person_add</mat-icon>
                </div>
                <span>Invite</span>
              </button>
            </div>
          </section>

          <!-- My Teams -->
          <section class="content-card teams-preview">
            <div class="card-header">
              <h2>
                <mat-icon>groups</mat-icon>
                My Teams
              </h2>
              <button class="view-all-btn" routerLink="/teams">View All</button>
            </div>
            <div class="teams-list">
              @if (teams().length === 0) {
                <div class="empty-state small">
                  <mat-icon>group_off</mat-icon>
                  <p>No teams yet</p>
                </div>
              } @else {
                @for (team of teams().slice(0, 4); track team.id) {
                  <div class="team-item" [routerLink]="['/teams', team.id, 'projects']">
                    <div class="team-avatar" [style.background]="getTeamColor(team.id)">
                      {{ team.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="team-info">
                      <span class="team-name">{{ team.name }}</span>
                      <span class="team-members">{{ team.members_count }} members</span>
                    </div>
                    <mat-icon class="arrow-icon">chevron_right</mat-icon>
                  </div>
                }
              }
            </div>
          </section>
        </div>
      </div>

      <!-- Progress Overview -->
      <section class="content-card progress-section">
        <h2>
          <mat-icon>analytics</mat-icon>
          Weekly Progress
        </h2>
        <div class="progress-chart">
          <div class="chart-bars">
            @for (day of weekDays; track day.name) {
              <div class="bar-wrapper">
                <div class="bar" [style.height.%]="day.value" [class]="day.color"></div>
                <span class="day-label">{{ day.name }}</span>
              </div>
            }
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot purple"></span>
              <span>Completed</span>
            </div>
            <div class="legend-item">
              <span class="dot blue"></span>
              <span>In Progress</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    // Header
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      .greeting {
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        p {
          color: #64748b;
          font-size: 0.95rem;
        }
      }

      .date-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        color: #64748b;
        font-weight: 500;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #7c3aed;
        }
      }
    }

    // Stats Grid
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }

      .stat-icon {
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
          color: white;
        }
      }

      .stat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
        }
      }

      .stat-trend {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &.up {
          color: #10b981;
          background: #ecfdf5;
        }

        &.down {
          color: #ef4444;
          background: #fef2f2;
        }
      }

      &.purple .stat-icon { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
      &.blue .stat-icon { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
      &.green .stat-icon { background: linear-gradient(135deg, #10b981, #34d399); }
      &.orange .stat-icon { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
    }

    // Main Content
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .content-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

      h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: #7c3aed;
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h2 { margin-bottom: 0; }
      }

      .view-all-btn {
        background: none;
        border: none;
        color: #7c3aed;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #6d28d9;
        }
      }
    }

    // Tasks List
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
      }

      &.priority-high { border-left-color: #ef4444; }
      &.priority-medium { border-left-color: #f59e0b; }
      &.priority-low { border-left-color: #10b981; }

      .task-status {
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &.done mat-icon { color: #10b981; }
        &.in_progress mat-icon { color: #3b82f6; }
        &.todo mat-icon { color: #94a3b8; }
      }

      .task-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .task-title {
          font-weight: 500;
          color: #1e293b;
        }

        .task-desc {
          font-size: 0.8rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
        }
      }

      .task-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .priority-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;

          &.high { background: #fef2f2; color: #dc2626; }
          &.medium { background: #fffbeb; color: #d97706; }
          &.low { background: #ecfdf5; color: #059669; }
        }

        .due-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #94a3b8;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      p {
        font-weight: 500;
        color: #64748b;
        margin-bottom: 0.25rem;
      }

      span {
        font-size: 0.85rem;
      }

      &.small {
        padding: 2rem;

        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }
      }
    }

    // Side Content
    .side-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    // Quick Actions
    .quick-actions {
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f8fafc;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: white;
          }

          &.purple { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
          &.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
          &.green { background: linear-gradient(135deg, #10b981, #34d399); }
          &.orange { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
        }

        span {
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
        }
      }
    }

    // Teams Preview
    .teams-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .team-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f8fafc;

        .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .team-avatar {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: white;
        font-size: 0.9rem;
      }

      .team-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;

        .team-name {
          font-weight: 500;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .team-members {
          font-size: 0.75rem;
          color: #94a3b8;
        }
      }

      .arrow-icon {
        color: #94a3b8;
        opacity: 0;
        transform: translateX(-4px);
        transition: all 0.2s ease;
      }
    }

    // Progress Section
    .progress-section {
      .progress-chart {
        display: flex;
        align-items: flex-end;
        gap: 2rem;
      }

      .chart-bars {
        flex: 1;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 120px;
        padding: 0 1rem;
      }

      .bar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        .bar {
          width: 32px;
          border-radius: 6px 6px 0 0;
          min-height: 8px;
          transition: height 0.5s ease;

          &.purple { background: linear-gradient(180deg, #7c3aed, #a78bfa); }
          &.blue { background: linear-gradient(180deg, #3b82f6, #60a5fa); }
        }

        .day-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }
      }

      .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-bottom: 1.5rem;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;

            &.purple { background: #7c3aed; }
            &.blue { background: #3b82f6; }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 1rem;

        .greeting h1 {
          font-size: 1.5rem;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private teamsService = inject(TeamsService);
  private tasksService = inject(TasksService);
  private router = inject(Router);

  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  weekDays = [
    { name: 'Mon', value: 65, color: 'purple' },
    { name: 'Tue', value: 45, color: 'blue' },
    { name: 'Wed', value: 80, color: 'purple' },
    { name: 'Thu', value: 55, color: 'blue' },
    { name: 'Fri', value: 90, color: 'purple' },
    { name: 'Sat', value: 30, color: 'blue' },
    { name: 'Sun', value: 20, color: 'purple' }
  ];

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

  // Tasks from all projects
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
    // Load tasks from localStorage or API
    const storedTasks = localStorage.getItem('dashboard_tasks');
    if (storedTasks) {
      this.allTasks.set(JSON.parse(storedTasks));
    }
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

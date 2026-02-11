import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Task, TaskStatus } from '../../core/models';
import { TasksService, AuthService } from '../../core/services';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  private tasksService = inject(TasksService);
  private authService = inject(AuthService);

  // Signal Input
  task = input.required<Task>();
  
  // Signal Output
  statusChange = output<TaskStatus>();
  assignToMe = output<void>();

  isOverdue = computed(() => {
    if (!this.task().due_date) return false;
    return new Date(this.task().due_date!) < new Date();
  });

  isDueSoon = computed(() => {
    if (!this.task().due_date) return false;
    const dueDate = new Date(this.task().due_date!);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });

  formattedDate = computed(() => {
    if (!this.task().due_date) return '';
    const date = new Date(this.task().due_date!);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  getInitials(): string {
    const name = this.task().assignee_name || 'Unassigned';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  onStatusChange(newStatus: TaskStatus): void {
    this.statusChange.emit(newStatus);
  }

  onAssignToMe(event: Event): void {
    event.stopPropagation();
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.tasksService.updateTask(this.task().id, { 
        assignee_id: String(currentUser.id)
      }).subscribe();
    }
  }
}

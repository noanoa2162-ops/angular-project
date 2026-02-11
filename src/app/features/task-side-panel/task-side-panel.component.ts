import { Component, input, output, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { trigger, transition, style, animate } from '@angular/animations';
import { Task, TaskStatus, TaskPriority } from '../../core/models';
import { TasksService, CommentsService, AuthService } from '../../core/services';

@Component({
  selector: 'app-task-side-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './task-side-panel.component.html',
  styleUrl: './task-side-panel.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class TaskSidePanelComponent implements OnInit, OnDestroy {
  // Signal Inputs
  task = input.required<Task>();
  projectId = input.required<string>();
  
  // Signal Outputs
  close = output<void>();
  taskUpdated = output<void>();
  taskDeleted = output<void>();

  // Services
  private tasksService = inject(TasksService);
  protected commentsService = inject(CommentsService);
  private authService = inject(AuthService);

  // Get current user's initial for avatar
  get userInitial(): string {
    const user = this.authService.currentUser();
    return user?.name?.charAt(0).toUpperCase() || '?';
  }

  // Local state
  newComment = '';
  isEditing = signal(false);
  editTitle = '';
  editDescription = '';
  selectedTab = 0;
  showComments = false;

  ngOnInit(): void {
    this.loadComments();
    this.editTitle = this.task().title;
    this.editDescription = this.task().description || '';
  }

  ngOnDestroy(): void {
    this.commentsService.clearComments();
  }

  loadComments(): void {
    this.commentsService.loadComments(this.task().id).subscribe(comments => {
      this.commentsService.setLoadedComments(comments);
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'todo': 'radio_button_unchecked',
      'in-progress': 'pending',
      'done': 'check_circle'
    };
    return icons[status] || 'circle';
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
    if (this.isEditing()) {
      this.editTitle = this.task().title;
      this.editDescription = this.task().description || '';
    }
  }

  saveEdit(): void {
    this.tasksService.updateTask(this.task().id, {
      title: this.editTitle,
      description: this.editDescription
    }).subscribe(() => {
      this.isEditing.set(false);
      this.taskUpdated.emit();
    });
  }

  changeStatus(newStatus: TaskStatus): void {
    this.tasksService.updateTask(this.task().id, { status: newStatus }).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  changePriority(newPriority: TaskPriority): void {
    this.tasksService.updateTask(this.task().id, { priority: newPriority }).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  startTask(): void {
    this.tasksService.startTask(this.task().id).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  completeTask(): void {
    this.tasksService.completeTask(this.task().id).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  reopenTask(): void {
    this.tasksService.moveToTodo(this.task().id).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksService.deleteTask(this.task().id).subscribe(() => {
        this.taskDeleted.emit();
      });
    }
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.commentsService.addComment({
        content: this.newComment.trim(),
        taskId: this.task().id
      }).subscribe(() => {
        this.newComment = '';
      });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getAuthorInitial(name: string | undefined): string {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

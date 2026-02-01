import { Component, input, output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../../core/models';
import { TasksService, CommentsService } from '../../../core/services';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './task-side-panel.component.html',
  styleUrl: './task-side-panel.component.scss'
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

  // Local state
  newComment = '';

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.commentsService.clearComments();
  }

  loadComments(): void {
    this.commentsService.loadComments(this.task().id).subscribe();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    };
    return labels[status] || status;
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
        task_id: this.task().id
      }).subscribe(() => {
        this.newComment = '';
      });
    }
  }
}

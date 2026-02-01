import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskStatus } from '../../../core/models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  // Signal Input
  task = input.required<Task>();
  
  // Signal Output
  statusChange = output<TaskStatus>();

  isOverdue = computed(() => {
    if (!this.task().due_date) return false;
    return new Date(this.task().due_date!) < new Date();
  });

  onStatusChange(newStatus: TaskStatus): void {
    this.statusChange.emit(newStatus);
  }
}

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus } from '../../../core/models';
import { TaskCardComponent } from './task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TaskCardComponent
  ],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss'
})
export class BoardColumnComponent {
  // Signal Inputs
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();
  
  // Signal Outputs
  taskClick = output<Task>();
  statusChange = output<{ task: Task; newStatus: TaskStatus }>();

  onStatusChange(task: Task, newStatus: TaskStatus): void {
    this.statusChange.emit({ task, newStatus });
  }
}

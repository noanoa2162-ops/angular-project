import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TasksService, ProjectsService } from '../../core/services';
import { Task, TaskStatus } from '../../core/models';
import { BoardColumnComponent } from './components/board-column.component';
import { TaskSidePanelComponent } from './components/task-side-panel.component';
import { CreateTaskDialogComponent } from './dialogs/create-task-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BoardColumnComponent,
    TaskSidePanelComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  protected tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  
  projectId = signal<string>('');
  projectName = signal<string>('Project Board');
  hasLoadedOnce = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId.set(params['projectId']);
      this.loadTasks();
      this.loadProjectName();
    });
  }

  ngOnDestroy(): void {
    this.tasksService.clearTasks();
  }

  loadTasks(): void {
    this.tasksService.loadTasks(this.projectId()).subscribe({
      next: () => this.hasLoadedOnce.set(true)
    });
  }

  loadProjectName(): void {
    const project = this.projectsService.getProjectById(this.projectId());
    if (project) {
      this.projectName.set(project.name);
    } else {
      this.projectsService.loadProjects().subscribe(() => {
        const p = this.projectsService.getProjectById(this.projectId());
        if (p) this.projectName.set(p.name);
      });
    }
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.createTask({
          title: result.title,
          description: result.description,
          priority: result.priority,
          projectId: this.projectId(),
          status: 'todo'
        }).subscribe();
      }
    });
  }

  onTaskClick(task: Task): void {
    this.tasksService.selectTask(task);
  }

  onStatusChange(event: { task: Task; newStatus: TaskStatus }): void {
    this.tasksService.updateTask(event.task.id, { status: event.newStatus }).subscribe();
  }

  onTaskUpdated(): void {
    // Task is updated via service
  }

  onTaskDeleted(): void {
    this.closePanel();
  }

  closePanel(): void {
    this.tasksService.clearSelectedTask();
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }
}

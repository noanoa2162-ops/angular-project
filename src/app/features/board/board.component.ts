import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { TasksService, ProjectsService, AuthService } from '../../core/services';
import { Task, TaskStatus, TaskPriority } from '../../core/models';
import { TaskCardComponent } from './components/task-card.component';
import { TaskSidePanelComponent } from './components/task-side-panel.component';
import { CreateTaskDialogComponent } from './dialogs/create-task-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatTooltipModule,
    DragDropModule,
    TaskCardComponent,
    TaskSidePanelComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  protected tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  
  projectId = signal<string>('');
  projectName = signal<string>('Project Board');
  hasLoadedOnce = signal(false);
  showOnlyMyTasks = signal(false);
  viewMode = signal<'board' | 'list'>('board');

  // Filtering signals
  searchQuery = signal<string>('');
  priorityFilter = signal<'all' | TaskPriority>('all');

  // Column IDs for drag-drop
  columnIds = ['todo-column', 'in-progress-column', 'done-column'];

  // Stats computed signals
  totalTasks = computed(() => 
    this.tasksService.todoTasks().length + 
    this.tasksService.inProgressTasks().length + 
    this.tasksService.doneTasks().length
  );

  completionPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.tasksService.doneTasks().length / total) * 100);
  });

  // Filtered task lists using computed signals
  filteredTodoTasks = computed(() => this.filterTasks(this.tasksService.todoTasks()));
  filteredInProgressTasks = computed(() => this.filterTasks(this.tasksService.inProgressTasks()));
  filteredDoneTasks = computed(() => this.filterTasks(this.tasksService.doneTasks()));

  // All filtered tasks for list view
  allFilteredTasks = computed(() => [
    ...this.filteredTodoTasks(),
    ...this.filteredInProgressTasks(),
    ...this.filteredDoneTasks()
  ]);

  // Check if any filters are active
  hasActiveFilters = computed(() => this.searchQuery().length > 0 || this.priorityFilter() !== 'all');

  getTotalTasks(): number {
    return this.filteredTodoTasks().length + this.filteredInProgressTasks().length + this.filteredDoneTasks().length;
  }

  private filterTasks(tasks: Task[]): Task[] {
    let filtered = tasks;
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by priority
    const priority = this.priorityFilter();
    if (priority !== 'all') {
      filtered = filtered.filter(task => task.priority === priority);
    }

    // Filter by current user
    if (this.showOnlyMyTasks()) {
      const currentUserId = this.authService.currentUser()?.id;
      filtered = filtered.filter(task => task.assignee_id === currentUserId);
    }
    
    return filtered;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setPriorityFilter(value: 'all' | TaskPriority): void {
    this.priorityFilter.set(value);
  }

  onPriorityFilterChange(event: MatButtonToggleChange): void {
    this.priorityFilter.set(event.value);
  }

  filterMyTasks(): void {
    this.showOnlyMyTasks.update(v => !v);
  }

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
          project_id: this.projectId(),
          status: 'todo',
          due_date: result.dueDate || undefined
        }).subscribe({
          next: () => {},
          error: () => {
            alert('Failed to create task. Please make sure the server is running.');
          }
        });
      }
    });
  }

  onTaskClick(task: Task): void {
    this.tasksService.selectTask(task);
  }

  onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      // Reorder within same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move to different column
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Update task status in backend
      this.tasksService.updateTask(task.id, { status: newStatus }).subscribe();
    }
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

  // List view helpers
  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      'todo': 'To Do',
      'in_progress': 'In Progress',
      'done': 'Done'
    };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  toggleTaskStatus(task: Task, event: Event): void {
    event.stopPropagation();
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe();
  }
}

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = '/api/tasks';
  
  // Signals for reactive state
  private _tasks = signal<Task[]>([]);
  private _selectedTask = signal<Task | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly tasks = this._tasks.asReadonly();
  readonly selectedTask = this._selectedTask.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals for board columns
  readonly todoTasks = computed(() => 
    this._tasks().filter(t => t.status === 'todo')
  );
  
  readonly inProgressTasks = computed(() => 
    this._tasks().filter(t => t.status === 'in-progress')
  );
  
  readonly doneTasks = computed(() => 
    this._tasks().filter(t => t.status === 'done')
  );

  loadTasks(projectId: string): Observable<Task[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = new HttpParams().set('projectId', projectId);

    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
      tap(tasks => {
        this._tasks.set(tasks);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load tasks');
        return throwError(() => error);
      })
    );
  }

  createTask(data: CreateTaskRequest): Observable<Task> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Task>(this.apiUrl, data).pipe(
      tap(task => {
        this._tasks.update(tasks => [...tasks, task]);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to create task');
        return throwError(() => error);
      })
    );
  }

  updateTask(id: string, data: UpdateTaskRequest): Observable<Task> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.patch<Task>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => 
          tasks.map(task => task.id === id ? updatedTask : task)
        );
        // Update selected task if it's the one being updated
        if (this._selectedTask()?.id === id) {
          this._selectedTask.set(updatedTask);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to update task');
        return throwError(() => error);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(task => task.id !== id));
        // Clear selected task if it's the one being deleted
        if (this._selectedTask()?.id === id) {
          this._selectedTask.set(null);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to delete task');
        return throwError(() => error);
      })
    );
  }

  // Change task status helpers
  startTask(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'in-progress' });
  }

  completeTask(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'done' });
  }

  moveToTodo(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'todo' });
  }

  selectTask(task: Task | null): void {
    this._selectedTask.set(task);
  }

  clearSelectedTask(): void {
    this._selectedTask.set(null);
  }

  clearTasks(): void {
    this._tasks.set([]);
    this._selectedTask.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}

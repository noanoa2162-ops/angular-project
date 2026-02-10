import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models';

// server URL
const API_URL = 'https://tasks-teacher-server.onrender.com/api';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/tasks`;

  private _tasks = signal<Task[]>([]);
  private _selectedTask = signal<Task | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly selectedTask = this._selectedTask.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly todoTasks = computed(() => 
    this._tasks().filter(t => t.status?.toLowerCase() === 'todo')
  );
  
  readonly inProgressTasks = computed(() => 
    this._tasks().filter(t => t.status?.toLowerCase() === 'in_progress')
  );
  
  readonly doneTasks = computed(() => 
    this._tasks().filter(t => t.status?.toLowerCase() === 'done')
  );

  getTasks(): Observable<Task[]> {
    this._isLoading.set(true);
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => {
        this._tasks.set(tasks);
        this._isLoading.set(false);
      })
    );
  }

  loadTasks(projectId: string): Observable<Task[]> {
    this._isLoading.set(true);
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
      tap(tasks => {
        this._tasks.set(tasks);
        this._isLoading.set(false);
      })
    );
  }

  createTask(data: CreateTaskRequest): Observable<Task> {
    const payload = {
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      projectId: Number(data.project_id),
      due_date: data.due_date
    };
    return this.http.post<Task>(this.apiUrl, payload).pipe(
      tap(newTask => {
        this._tasks.update(tasks => [...tasks, newTask]);
      })
    );
  }

  updateTask(id: string, data: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => 
          tasks.map(task => String(task.id) === String(id) ? updatedTask : task)
        );
        if (String(this._selectedTask()?.id) === String(id)) {
          this._selectedTask.set(updatedTask);
        }
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(task => String(task.id) !== String(id)));
        if (String(this._selectedTask()?.id) === String(id)) {
          this._selectedTask.set(null);
        }
      })
    );
  }

  startTask(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'in_progress' });
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

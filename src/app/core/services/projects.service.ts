import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Project, CreateProjectRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = '/api/projects';
  
  // Signals for reactive state
  private _projects = signal<Project[]>([]);
  private _selectedTeamId = signal<string | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly projects = this._projects.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signal: filter projects by selected team
  readonly teamProjects = computed(() => {
    const teamId = this._selectedTeamId();
    if (!teamId) return this._projects();
    // Compare as strings to handle both string and number team_id
    return this._projects().filter(p => String(p.team_id) === String(teamId));
  });

  setSelectedTeam(teamId: string): void {
    this._selectedTeamId.set(teamId);
  }

  loadProjects(): Observable<Project[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(projects => {
        this._projects.set(projects);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load projects');
        return throwError(() => error);
      })
    );
  }

  createProject(data: CreateProjectRequest): Observable<Project> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Project>(this.apiUrl, data).pipe(
      tap(project => {
        this._projects.update(projects => [...projects, project]);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to create project');
        return throwError(() => error);
      })
    );
  }

  getProjectById(id: string): Project | undefined {
    return this._projects().find(p => p.id === id);
  }

  clearError(): void {
    this._error.set(null);
  }
}

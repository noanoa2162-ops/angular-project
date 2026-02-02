import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectRequest } from '../models';

const API_URL = 'https://tasks-teacher-server.onrender.com/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/projects`;

  private _projects = signal<Project[]>([]);
  private _selectedTeamId = signal<string | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly teamProjects = computed(() => {
    const teamId = this._selectedTeamId();
    if (!teamId) return this._projects();
    return this._projects().filter(p => String(p.team_id) === String(teamId));
  });

  getProjects(): Observable<Project[]> {
    this._isLoading.set(true);
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(projects => {
        this._projects.set(projects);
        this._isLoading.set(false);
      })
    );
  }

  loadProjects(): Observable<Project[]> {
    return this.getProjects();
  }

  getProjectById(id: string): Project | undefined {
    return this._projects().find(p => String(p.id) === String(id));
  }

  setSelectedTeam(teamId: string | null): void {
    this._selectedTeamId.set(teamId);
  }

  createProject(data: CreateProjectRequest): Observable<Project> {
    const payload: { name: string; description: string; teamId: number; color?: string } = {
      name: data.name,
      description: data.description,
      teamId: Number(data.teamId)
    };
    if (data.color) payload.color = data.color;
    
    return this.http.post<Project>(this.apiUrl, payload).pipe(
      tap(() => {
        this.getProjects().subscribe();
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._projects.update(projects => projects.filter(p => p.id !== id));
      })
    );
  }

  clearProjects(): void {
    this._projects.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }
}

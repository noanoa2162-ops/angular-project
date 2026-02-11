import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Team } from '../models';

const API_URL = 'https://tasks-teacher-server.onrender.com/api';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/teams`;

  private _teams = signal<Team[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  readonly teams = this._teams.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  getTeams(): Observable<Team[]> {
    this._isLoading.set(true);
    return this.http.get<Team[]>(this.apiUrl).pipe(
      tap(teams => {
        this._teams.set(teams);
        this._isLoading.set(false);
      })
    );
  }

  loadTeams(): Observable<Team[]> {
    return this.getTeams();
  }

  createTeam(name: string, description?: string, color?: string): Observable<Team> {
    const payload: { name: string; description?: string; color?: string } = { name };
    if (description) payload.description = description;
    if (color) payload.color = color;
    
    return this.http.post<Team>(this.apiUrl, payload).pipe(
      tap(() => {
        this.getTeams().subscribe();
      })
    );
  }

  addMember(teamId: string, userId: number, role: string = 'member'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${teamId}/members`, { userId, role }).pipe(
      tap(() => {
        this.getTeams().subscribe();
      })
    );
  }

  clearTeams(): void {
    this._teams.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }
}

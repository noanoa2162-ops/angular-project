import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Team, CreateTeamRequest, AddMemberRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = '/api/teams';
  
  // Signals for reactive state
  private _teams = signal<Team[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly teams = this._teams.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadTeams(): Observable<Team[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<Team[]>(this.apiUrl).pipe(
      tap(teams => {
        this._teams.set(teams);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load teams');
        return throwError(() => error);
      })
    );
  }

  createTeam(data: CreateTeamRequest): Observable<Team> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Team>(this.apiUrl, data).pipe(
      tap(team => {
        this._teams.update(teams => [...teams, team]);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to create team');
        return throwError(() => error);
      })
    );
  }

  addMember(teamId: string, data: AddMemberRequest): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<void>(`${this.apiUrl}/${teamId}/members`, data).pipe(
      tap(() => {
        // Update members count locally
        this._teams.update(teams => 
          teams.map(team => 
            team.id === teamId 
              ? { ...team, members_count: team.members_count + 1 }
              : team
          )
        );
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to add member');
        return throwError(() => error);
      })
    );
  }

  clearError(): void {
    this._error.set(null);
  }
}

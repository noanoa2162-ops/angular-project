import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly apiUrl = '/api/auth';
  
  // Signals for reactive state
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public computed signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => !!this.getToken());

  constructor() {
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Login failed');
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.setToken(response.token);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Registration failed');
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      // Token exists, user is considered authenticated
      // User details will be loaded from API if needed
    }
  }

  clearError(): void {
    this._error.set(null);
  }
}

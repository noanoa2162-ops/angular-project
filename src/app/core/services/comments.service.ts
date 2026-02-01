import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Comment, CreateCommentRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = '/api/comments';
  
  // Signals for reactive state
  private _comments = signal<Comment[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly comments = this._comments.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadComments(taskId: string): Observable<Comment[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = new HttpParams().set('taskId', taskId);

    return this.http.get<Comment[]>(this.apiUrl, { params }).pipe(
      tap(comments => {
        this._comments.set(comments);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load comments');
        return throwError(() => error);
      })
    );
  }

  addComment(data: CreateCommentRequest): Observable<Comment> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Comment>(this.apiUrl, data).pipe(
      tap(comment => {
        this._comments.update(comments => [...comments, comment]);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to add comment');
        return throwError(() => error);
      })
    );
  }

  clearComments(): void {
    this._comments.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }
}

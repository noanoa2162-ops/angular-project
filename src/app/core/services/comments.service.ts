import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Comment, CreateCommentRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  // In-memory storage for all comments
  private allComments: Map<string, Comment[]> = new Map();
  
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

    // Get comments for this task from in-memory storage
    const taskComments = this.allComments.get(taskId) || [];
    
    // Simulate async loading
    return of(taskComments).pipe(
      delay(200)
    );
  }

  // Call this after subscribe to update signal state
  setLoadedComments(comments: Comment[]): void {
    this._comments.set(comments);
    this._isLoading.set(false);
  }

  addComment(data: CreateCommentRequest): Observable<Comment> {
    this._isLoading.set(true);
    this._error.set(null);

    // Create new comment with generated ID
    const newComment: Comment = {
      id: crypto.randomUUID(),
      content: data.content,
      task_id: data.taskId,
      user_id: 'current-user',
      user_name: 'You',
      created_at: new Date().toISOString()
    };

    // Store in memory
    const taskComments = this.allComments.get(data.taskId) || [];
    taskComments.push(newComment);
    this.allComments.set(data.taskId, taskComments);

    // Update signal
    this._comments.update(comments => [...comments, newComment]);
    this._isLoading.set(false);

    return of(newComment).pipe(delay(100));
  }

  deleteComment(commentId: string, taskId: string): Observable<void> {
    const taskComments = this.allComments.get(taskId) || [];
    const filteredComments = taskComments.filter(c => c.id !== commentId);
    this.allComments.set(taskId, filteredComments);
    this._comments.set(filteredComments);
    return of(void 0);
  }

  clearComments(): void {
    this._comments.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }
}

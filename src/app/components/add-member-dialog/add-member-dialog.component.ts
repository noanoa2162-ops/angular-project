import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsService } from '../../services';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  private teamsService = inject(TeamsService);
  protected data = inject<{ teamId: string; teamName: string }>(MAT_DIALOG_DATA);
  
  userId: number | null = null;
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  isValidUserId(): boolean {
    return this.userId !== null && this.userId > 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (!this.isValidUserId() || this.userId === null) return;
    
    this.isLoading.set(true);
    this.error.set(null);
    
    this.teamsService.addMember(this.data.teamId, this.userId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.success.set(true);
        // Close after short delay to show success
        setTimeout(() => {
          this.dialogRef.close({ success: true });
        }, 800);
      },
      error: (err) => {
        this.isLoading.set(false);
        let errorMessage = 'Failed to add member';
        
        if (err.status === 404) {
          errorMessage = 'User not found. Please check the user ID.';
        } else if (err.status === 400) {
          errorMessage = 'User is already a member of this team.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to add members.';
        } else if (err.status === 500) {
          if (err.error?.error?.includes('FOREIGN KEY')) {
            errorMessage = 'This User ID does not exist in the system.';
          } else {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.error.set(errorMessage);
      }
    });
  }
}

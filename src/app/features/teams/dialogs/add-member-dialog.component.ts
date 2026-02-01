import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  protected data = inject<{ teamName: string }>(MAT_DIALOG_DATA);
  
  userId = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.userId.trim()) {
      this.dialogRef.close(this.userId.trim());
    }
  }
}

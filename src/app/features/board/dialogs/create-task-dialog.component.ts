import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TaskPriority } from '../../../core/models';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-task-dialog.component.html',
  styleUrl: './create-task-dialog.component.scss'
})
export class CreateTaskDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateTaskDialogComponent>);
  
  title = '';
  description = '';
  priority: TaskPriority = 'medium';

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.title.trim()) {
      this.dialogRef.close({
        title: this.title.trim(),
        description: this.description.trim(),
        priority: this.priority
      });
    }
  }
}

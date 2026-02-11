import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  
  projectName = '';
  description = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.projectName.trim()) {
      this.dialogRef.close({
        name: this.projectName.trim(),
        description: this.description.trim()
      });
    }
  }
}

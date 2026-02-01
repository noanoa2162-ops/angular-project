import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-team-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-team-dialog.component.html',
  styleUrl: './create-team-dialog.component.scss'
})
export class CreateTeamDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateTeamDialogComponent>);
  
  teamName = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.teamName.trim()) {
      this.dialogRef.close(this.teamName.trim());
    }
  }
}

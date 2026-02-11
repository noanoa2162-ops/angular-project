import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Project } from '../../core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  // Signal Input - Angular 17+ modern syntax
  project = input.required<Project>();
  
  // Signal Output - Angular 17+ modern syntax
  openProject = output<Project>();

  onOpen(event: Event): void {
    event.stopPropagation();
    this.openProject.emit(this.project());
  }
}

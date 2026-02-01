import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjectsService } from '../../core/services';
import { Project } from '../../core/models';
import { CreateProjectDialogComponent } from './dialogs/create-project-dialog.component';
import { ProjectCardComponent } from './components/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ProjectCardComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  protected projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  
  private teamId = signal<string>('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId.set(params['teamId']);
      this.projectsService.setSelectedTeam(this.teamId());
      this.loadProjects();
    });
  }

  loadProjects(): void {
    this.projectsService.loadProjects().subscribe();
  }

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      console.log('Team ID:', this.teamId());
      if (result) {
        this.projectsService.createProject({
          name: result.name,
          description: result.description,
          teamId: this.teamId()
        }).subscribe({
          next: (project) => console.log('Project created:', project),
          error: (err) => console.error('Error creating project:', err)
        });
      }
    });
  }

  onOpenProject(project: Project): void {
    this.router.navigate(['/projects', project.id, 'board']);
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }
}

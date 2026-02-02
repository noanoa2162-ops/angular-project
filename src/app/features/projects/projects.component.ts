import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjectsService, TeamsService } from '../../core/services';
import { Project } from '../../core/models';
import { CreateProjectDialogComponent } from './dialogs/create-project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  protected projectsService = inject(ProjectsService);
  private teamsService = inject(TeamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  
  teamId = signal<string>('');
  teamName = signal<string>('Projects');
  hasLoadedOnce = signal(false);
  
  // Project gradients
  private projectGradients = [
    'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'linear-gradient(135deg, #059669, #34d399)',
    'linear-gradient(135deg, #d97706, #fbbf24)',
    'linear-gradient(135deg, #dc2626, #f87171)',
    'linear-gradient(135deg, #2563eb, #60a5fa)',
    'linear-gradient(135deg, #db2777, #f472b6)',
    'linear-gradient(135deg, #0d9488, #5eead4)',
    'linear-gradient(135deg, #ea580c, #fb923c)'
  ];

  // Color mapping for projects
  private colorGradients: Record<string, string> = {
    'purple': 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'blue': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'green': 'linear-gradient(135deg, #10b981, #34d399)',
    'orange': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'pink': 'linear-gradient(135deg, #ec4899, #f472b6)',
    'cyan': 'linear-gradient(135deg, #06b6d4, #22d3ee)'
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId.set(params['teamId']);
      this.projectsService.setSelectedTeam(this.teamId());
      this.loadProjects();
      this.loadTeamName();
    });
  }

  loadProjects(): void {
    this.projectsService.loadProjects().subscribe({
      next: () => this.hasLoadedOnce.set(true)
    });
  }

  loadTeamName(): void {
    const team = this.teamsService.teams().find(t => t.id === this.teamId());
    if (team) {
      this.teamName.set(team.name);
    }
  }

  getProjectGradient(project: Project): string {
    // Use project's saved color if available, otherwise fallback to gradient based on ID
    if (project.color && this.colorGradients[project.color]) {
      return this.colorGradients[project.color];
    }
    const index = parseInt(project.id, 10) % this.projectGradients.length;
    return this.projectGradients[index] || this.projectGradients[0];
  }

  getProjectInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '450px',
      panelClass: 'dark-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectsService.createProject({
          name: result.name,
          description: result.description,
          teamId: this.teamId(),
          color: result.color
        }).subscribe();
      }
    });
  }

  openProject(project: Project): void {
    this.router.navigate(['/projects', project.id, 'board']);
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }
}

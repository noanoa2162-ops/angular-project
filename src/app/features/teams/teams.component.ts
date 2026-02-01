import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamsService } from '../../core/services';
import { Team } from '../../core/models';
import { CreateTeamDialogComponent } from './dialogs/create-team-dialog.component';
import { AddMemberDialogComponent } from './dialogs/add-member-dialog.component';
import { TeamCardComponent } from './components/team-card.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    TeamCardComponent
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  protected teamsService = inject(TeamsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamsService.loadTeams().subscribe();
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamsService.createTeam({ name: result }).subscribe();
      }
    });
  }

  openAddMemberDialog(team: Team): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px',
      data: { teamName: team.name }
    });

    dialogRef.afterClosed().subscribe(userId => {
      if (userId) {
        this.teamsService.addMember(team.id, { userId }).subscribe();
      }
    });
  }

  onOpenTeam(team: Team): void {
    this.router.navigate(['/teams', team.id, 'projects']);
  }
}

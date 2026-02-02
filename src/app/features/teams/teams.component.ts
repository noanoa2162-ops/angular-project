import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamsService } from '../../core/services';
import { Team } from '../../core/models';
import { CreateTeamDialogComponent } from './dialogs/create-team-dialog.component';
import { AddMemberDialogComponent } from './dialogs/add-member-dialog.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  protected teamsService = inject(TeamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  hasLoadedOnce = signal(false);
  searchQuery = signal('');
  
  // Filtered teams based on search
  filteredTeams = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.teamsService.teams();
    }
    return this.teamsService.teams().filter(team => 
      team.name.toLowerCase().includes(query)
    );
  });
  
  // Team gradient colors
  private teamGradients = [
    'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'linear-gradient(135deg, #059669, #34d399)',
    'linear-gradient(135deg, #d97706, #fbbf24)',
    'linear-gradient(135deg, #dc2626, #f87171)',
    'linear-gradient(135deg, #2563eb, #60a5fa)',
    'linear-gradient(135deg, #db2777, #f472b6)',
    'linear-gradient(135deg, #0d9488, #5eead4)',
    'linear-gradient(135deg, #ea580c, #fb923c)'
  ];

  private memberGradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)'
  ];

  // Color mapping for teams
  private colorGradients: Record<string, string> = {
    'purple': 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'blue': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'green': 'linear-gradient(135deg, #10b981, #34d399)',
    'orange': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'pink': 'linear-gradient(135deg, #ec4899, #f472b6)',
    'teal': 'linear-gradient(135deg, #14b8a6, #2dd4bf)'
  };

  ngOnInit(): void {
    // Check for search query param from header search
    this.route.queryParams.subscribe(params => {
      // Always update search query - set to value or empty string
      this.searchQuery.set(params['search'] || '');
    });
    
    this.teamsService.loadTeams().subscribe({
      next: () => this.hasLoadedOnce.set(true)
    });
  }

  getTeamGradient(team: Team): string {
    // Use team's saved color if available, otherwise fallback to gradient based on ID
    if (team.color && this.colorGradients[team.color]) {
      return this.colorGradients[team.color];
    }
    const index = parseInt(team.id, 10) % this.teamGradients.length;
    return this.teamGradients[index] || this.teamGradients[0];
  }

  getMemberGradient(index: number): string {
    return this.memberGradients[index % this.memberGradients.length];
  }

  getTeamInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getMemberInitial(index: number): string {
    const initials = ['J', 'M', 'S', 'A', 'K'];
    return initials[index % initials.length];
  }

  getTotalMembers(): number {
    const teams = this.teamsService.teams();
    const total = teams.reduce((sum, team) => sum + (team.members_count || 0), 0);
    return total;
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '480px',
      panelClass: 'dark-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamsService.createTeam(result.name, result.description).subscribe();
      }
    });
  }

  openAddMemberDialog(team: Team, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px',
      panelClass: 'dark-dialog',
      data: { teamId: team.id, teamName: team.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Reload teams to get updated member count
        this.teamsService.loadTeams().subscribe();
      }
    });
  }

  goToProjects(team: Team): void {
    this.router.navigate(['/teams', team.id, 'projects']);
  }

  // Handle search input changes - update URL
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    // Update URL with or without search param
    if (value.trim()) {
      this.router.navigate([], { 
        relativeTo: this.route,
        queryParams: { search: value.trim() },
        queryParamsHandling: 'merge'
      });
    } else {
      // Remove search param from URL
      this.router.navigate([], { 
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  // Clear search and update URL
  clearSearch(): void {
    this.searchQuery.set('');
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });
  }
}

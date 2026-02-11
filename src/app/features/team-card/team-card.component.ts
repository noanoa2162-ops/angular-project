import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Team } from '../../core/models';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss'
})
export class TeamCardComponent {
  team = input.required<Team>();
  openTeam = output<Team>();
  addMember = output<Team>();

  private colorGradients: Record<string, string> = {
    'purple': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    'blue': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    'green': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    'orange': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    'pink': 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    'teal': 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
    'red': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)'
  };

  private defaultGradients = [
    'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
  ];

  private memberColors = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  getTeamInitial(): string {
    return this.team().name.charAt(0).toUpperCase();
  }

  getTeamGradient(): string {
    const team = this.team();
    // Use saved color if exists
    if (team.color && this.colorGradients[team.color]) {
      return this.colorGradients[team.color];
    }
    // Fallback to ID-based gradient
    const index = parseInt(team.id, 10) % this.defaultGradients.length;
    return this.defaultGradients[index];
  }

  getMemberColor(index: number): string {
    return this.memberColors[index % this.memberColors.length];
  }

  getMemberInitial(index: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index % letters.length];
  }

  onOpen(event: Event): void {
    event.stopPropagation();
    this.openTeam.emit(this.team());
  }

  onAddMember(event: Event): void {
    event.stopPropagation();
    this.addMember.emit(this.team());
  }

  onMenuClick(event: Event): void {
    event.stopPropagation();
    // Future: Open menu
  }
}

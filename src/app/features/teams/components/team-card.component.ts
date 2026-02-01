import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Team } from '../../../core/models';

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
  // Signal Input - Angular 17+ modern syntax
  team = input.required<Team>();
  
  // Signal Output - Angular 17+ modern syntax
  openTeam = output<Team>();
  addMember = output<Team>();

  onOpen(event: Event): void {
    event.stopPropagation();
    this.openTeam.emit(this.team());
  }

  onAddMember(event: Event): void {
    event.stopPropagation();
    this.addMember.emit(this.team());
  }
}

import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./teams.component').then(m => m.TeamsComponent)
  }
];

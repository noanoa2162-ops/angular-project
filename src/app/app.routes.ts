import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'teams',
    loadChildren: () => import('./features/teams/teams.routes').then(m => m.TEAMS_ROUTES)
  },
  {
    path: 'teams/:teamId/projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'projects/:projectId/board',
    loadChildren: () => import('./features/board/board.routes').then(m => m.BOARD_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

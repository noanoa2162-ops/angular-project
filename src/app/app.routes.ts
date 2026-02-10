import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
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
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

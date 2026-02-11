import { Routes } from '@angular/router';
import { authGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'teams',
        loadChildren: () => import('./components/teams/teams.routes').then(m => m.TEAMS_ROUTES)
      },
      {
        path: 'teams/:teamId/projects',
        loadChildren: () => import('./components/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
      },
      {
        path: 'projects/:projectId/board',
        loadChildren: () => import('./components/board/board.routes').then(m => m.BOARD_ROUTES)
      },
      {
        path: 'profile',
        loadChildren: () => import('./components/profile/profile.routes').then(m => m.PROFILE_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () => import('./components/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

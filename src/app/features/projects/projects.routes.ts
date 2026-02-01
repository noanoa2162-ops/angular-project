import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./projects.component').then(m => m.ProjectsComponent)
  }
];

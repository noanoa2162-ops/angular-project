import { Routes } from '@angular/router';
import { publicGuard } from '../../guards';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent)
  }
];

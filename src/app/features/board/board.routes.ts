import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards';

export const BOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./board.component').then(m => m.BoardComponent)
  }
];

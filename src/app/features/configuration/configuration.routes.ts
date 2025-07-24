import { Routes } from '@angular/router';

export const configurationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/configuration/configuration.component')
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default configurationRoutes

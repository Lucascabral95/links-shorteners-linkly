import { Routes } from '@angular/router';

export const configurationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/configuration/configuration.component')
  },
]

export default configurationRoutes

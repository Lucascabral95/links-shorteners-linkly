import { Routes } from "@angular/router";

export const clicksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/clicks/clicks.component')
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default clicksRoutes

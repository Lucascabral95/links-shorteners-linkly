import { Routes } from "@angular/router";

const analyticsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/analytics-component/analytics-component.component')
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default analyticsRoutes;

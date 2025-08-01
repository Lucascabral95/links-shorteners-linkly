import { Routes } from "@angular/router";

export const clicksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/clicks/clicks.component')
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/click-details/click-detail-component/click-detail-component.component'),
    data: { renderMode: 'manual' }
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default clicksRoutes

import { Routes } from "@angular/router";

export const linksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/my-links-component/my-links-component.component')
  }, {
    path: 'detail/:id',
    loadComponent: () => import('./pages/link-detail/link-detail-component/link-detail-component.component')
  }, {
    path: '**',
    redirectTo: ''
  }
]

export default linksRoutes;

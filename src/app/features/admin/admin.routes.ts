import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/admin/admin.component'),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/users-admin/users-admin-component/users-admin-component.component')
      },
      {
        path: 'links',
        loadComponent: () =>
          import('./pages/admin/links-admin/links-admin-component/links-admin-component.component')
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/admin/analytics-admin/analytics-admin-component/analytics-admin-component.component')
      },
      {
        path: 'clicks',
        loadComponent: () =>
          import('./pages/admin/clicks-admin/clicks-admin-component/clicks-admin-component.component')
      }, {
        path: '**',
        redirectTo: 'users'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default adminRoutes;

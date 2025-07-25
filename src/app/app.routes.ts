import { Routes } from '@angular/router';
import linksRoutes from './features/links/links.routes';
import analyticsRoutes from './features/analytics/analytics.routes';
import configurationRoutes from './features/configuration/configuration.routes';
import clicksRoutes from './features/clicks/clicks.routes';
import { AuthGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';
import adminRoutes from './features/admin/admin.routes';
import { AdminGuard } from './shared/guards/admin.guard';
import usersRoutes from './features/users/users.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
    canActivate: [noAuthGuard],
  },
  {
    path: 'r',
    loadChildren: () => import('./features/redirect/redirect.routes'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-component/dashboard-component.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        children: adminRoutes,
        canActivate: [AdminGuard]
      },
      {
        path: 'analytics',
        children: analyticsRoutes,
      },
      {
        path: 'configuration',
        children: configurationRoutes,
      },
      {
        path: 'my-clicks',
        children: clicksRoutes,
      },
      {
        path: 'my-links',
        children: linksRoutes,
      },
      {
        path: 'user',
        children: usersRoutes,
      },
      {
        path: '',
        redirectTo: 'my-links',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

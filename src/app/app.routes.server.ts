import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'r',
    renderMode: RenderMode.Server
  },
  {
    path: 'r/:code',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard/admin',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/admin/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/analytics',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/analytics/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/configuration',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/configuration/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-clicks',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-clicks/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-links',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-links/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/user',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/user/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-clicks/detail/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/my-links/detail/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/user/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];

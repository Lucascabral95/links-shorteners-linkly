import { Routes } from "@angular/router";
import RedirectComponent from './pages/redirect/redirect.component';

const redirectRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: RedirectComponent,
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

export default redirectRoutes;

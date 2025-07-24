// features/users/users.routes.ts
import { Routes } from "@angular/router";
import UserDetailComponent from "./pages/user-detail/user-detail.component";
import UserListComponent from "./pages/user-detail/user-detail.component";

export const usersRoutes: Routes = [
  {
    path: ':id',
    component: UserDetailComponent,
  }
];

export default usersRoutes;

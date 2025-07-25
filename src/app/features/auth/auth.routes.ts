import { Routes } from "@angular/router";
import GoogleCallbackComponent from "./pages/google-callback/google-callback/google-callback.component";

const authRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/login-component/login-component.component")
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register-component/register-component.component")
  },
  {
    path: "reset/forgot-password",
    loadComponent: () => import("./pages/reset-password/forgot-password/forgot-password-component.component")
  },
  {
    path: "reset/confirm-password",
    loadComponent: () => import("./pages/reset-password/reset-password-change/reset-password-change.component")
  }, {
    path: "google-callback",
    component: GoogleCallbackComponent,
  },
  {
    path: "**",
    redirectTo: ""
  }
]

export default authRoutes;

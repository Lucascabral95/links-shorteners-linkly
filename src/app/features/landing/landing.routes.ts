import { Routes } from "@angular/router";
import LandingComponentComponent from "./pages/landing-component/landing-component.component";

const landingRoutes: Routes = [
  {
    path: '',
    component: LandingComponentComponent,
  }, {
    path: '**',
    redirectTo: ''
  }
]

export default landingRoutes;

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavComponent } from "../components/nav/nav.component";
import { CreateLinkModalComponent } from "../components/create-link-modal/create-link-modal/create-link-modal.component"; // Ajusta la ruta según tu estructura
import { AuthService } from '../../auth/services/auth.service';
import { AdminService } from '../../admin/service/admin.service';
import { GetQuantityResourceUserInterface } from '../../configuration/interfaces';

@Component({
  selector: 'app-dashboard-component',
  imports: [RouterOutlet, NavComponent, CreateLinkModalComponent,],
  templateUrl: './dashboard-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponentComponent implements OnInit {
  authService = inject(AuthService);
  adminService = inject(AdminService);

  isMenuOpen = signal(false);
  showModal = signal(false);

  ngOnInit(): void {
    this.authService.getPayloadJWT();

    this.adminService.getQuantityResourceUser(this.authService.getPayloadJWT()?.id!).subscribe()
  }

  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  openCreateLinkModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}

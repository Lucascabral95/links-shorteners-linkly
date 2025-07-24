import { Component, inject, PLATFORM_ID, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../service/dashboard.service';
import { environment } from '../../../../../environments/environment.development';
import { CreateLinkModalComponent } from '../create-link-modal/create-link-modal/create-link-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Sections } from '../../interfaces/sections.interface';

@Component({
  selector: 'nav-component',
  imports: [RouterLink, RouterLinkActive, CreateLinkModalComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  readonly dashboardService = inject(DashboardService);
  readonly versionApp = environment.version || '1.0.0';

  @Output() closeMenu = new EventEmitter<void>();

  sections = signal<Sections[]>([]);

  isAdmin = signal<boolean>(this.authService.isAdmin());

  readonly darkMode = this.dashboardService.darkMode;
  showModal = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dashboardService.initializeTheme(this.platformId);
    }

    this.sections.set(
      this.dashboardService.sections().filter(
        section => section.id !== 5 || this.authService.isAdmin()
      )
    );
  }

  toggleDarkMode(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const button = event.target as HTMLElement;
    button.setAttribute('disabled', 'true');

    const success = this.dashboardService.toggleDarkMode(this.platformId);

    setTimeout(() => {
      button.removeAttribute('disabled');
    }, 100);

    if (!success) {
      console.error('Error al cambiar tema');
    }
  }

  openModalAndCloseMenu(): void {
    this.showModal.set(true);
    this.closeMenu.emit();
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}

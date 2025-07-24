import { effect, inject, Injectable, signal } from '@angular/core';
import { Sections } from '../interfaces/sections.interface';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetQuantityResourceUserInterface } from '../../configuration/interfaces';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient)
  readonly darkMode = signal<boolean>(false);
  private readonly LIGHT_THEME = environment.lightMode;
  private readonly DARK_THEME = environment.darkMode;

  sections = signal<Sections[]>([
    {
      id: 1,
      name: "Mis links",
      security: false,
      icon: "fa-solid fa-link",
      link: "/dashboard/my-links"
    },
    {
      id: 2,
      name: "Mis Clicks",
      security: false,
      icon: "fa-solid fa-computer-mouse",
      link: "/dashboard/my-clicks"
    },
    {
      id: 3,
      name: "Analiticas",
      security: false,
      icon: "fa-solid fa-chart-line",
      link: "/dashboard/analytics"
    },
    {
      id: 4,
      name: "Configuración",
      security: false,
      icon: "fa-solid fa-gear",
      link: "/dashboard/configuration"
    },
    {
      id: 5,
      name: "Admin",
      security: true,
      icon: "fa-solid fa-user-tie",
      link: "/dashboard/admin"
    },
  ]
  )

  private readonly STORAGE_KEY = environment.STORAGE_KEY;

  constructor() {
    effect(() => {
      const isDark = this.darkMode();
      this.applyThemeImmediate(isDark);
    });
  }

  initializeTheme(platformId: any): void {
    if (!isPlatformBrowser(platformId)) return;

    try {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const isDark = savedTheme === 'true';

      this.applyThemeImmediate(isDark);

      this.darkMode.set(isDark);
    } catch (error) {
      console.warn('Error al cargar preferencias del tema:', error);
      this.darkMode.set(false);
    }
  }

  toggleDarkMode(platformId: any): boolean {
    if (!isPlatformBrowser(platformId)) return false;

    try {
      const newMode = !this.darkMode();
      this.darkMode.set(newMode);
      localStorage.setItem(this.STORAGE_KEY, newMode.toString());

      return true;
    } catch (error) {
      console.error('Error al cambiar tema:', error);
      return false;
    }
  }

  private applyThemeImmediate(isDark: boolean): void {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    const themeName = isDark ? this.DARK_THEME : this.LIGHT_THEME;

    html.setAttribute('data-theme', themeName);

    html.style.display = 'none';
    html.offsetHeight;
    html.style.display = '';
  }
}

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectService {
  router = inject(Router)

  getRedirectById(url: string): void {
    window.location.href = url;
  }
}

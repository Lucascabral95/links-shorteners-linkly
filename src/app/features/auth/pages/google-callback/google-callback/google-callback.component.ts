import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../environments/environment.development';

const STORAGE_KEY_AUTH = environment.STORAGE_KEY_AUTH;

@Component({
  selector: 'app-google-callback',
  imports: [],
  templateUrl: './google-callback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GoogleCallbackComponent {
  authService = inject(AuthService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.authService.handleGoogleCallback()
  }
}

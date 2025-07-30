import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RedirectService } from '../../service/redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { LinksService } from '../../../links/service/links.service';
import { GetLinkByIDInterface } from '../../../links/interfaces';
import { ErrorRedirectComponent } from "../../components/error-redirect/error-redirect/error-redirect.component";
import { AuthService } from '../../../auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const COUNTER_REDIRECT = environment.DIRECT_LINK

@Component({
  selector: 'app-redirect',
  imports: [ErrorRedirectComponent],
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RedirectComponent implements OnInit, OnDestroy {
  redirectService = inject(RedirectService)
  linkService = inject(LinksService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  idCurrent = signal<string | null>(null)
  private countdownInterval: any;
  counter = signal<number>(COUNTER_REDIRECT)
  loading = signal<boolean>(false)
  errors = signal<{ message: string, code: number }>({ message: '', code: 0 })
  pauseRedirect = signal<boolean>(false)
  dataLink = signal<GetLinkByIDInterface | null>(null)
  myUserIdAuthenticated = signal<string | null>(this.authService.getUserId() || null)
  uid = signal<string | null>(null)
  private readonly CIRCUMFERENCE = 339.292;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['code']
    const uid = this.route.snapshot.queryParamMap.get('uid') || null;
    this.idCurrent.set(paramId)
    this.uid.set(uid)

    if (isPlatformBrowser(this.platformId)) {
      this.startCountDown()
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  }

  startCountDown(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.redirectService.getLinkByShortCode(this.idCurrent()!).subscribe({
      next: (res: GetLinkByIDInterface) => {
        this.dataLink.set(res)
        this.loading.set(false)
      },
      error: (err: HttpErrorResponse) => {
        this.errors.set({ message: err.error?.message || 'Error desconocido', code: err.status })
        this.loading.set(false)
      }
    })

    this.countdownInterval = setInterval(() => {
      this.counter.set(this.counter() - 1)

      if (this.counter() === 0) {
        clearInterval(this.countdownInterval)

        this.redirectWithoutUserIdAndQueryParameter(this.dataLink()?.originalUrl!, this.dataLink()?.id!, this.uid() || '')

        this.loading.set(true)
        this.errors.set({ message: '', code: 0 })
      }
    }, 1000)
  }

  redirectWithoutUserIdAndQueryParameter(url: string, linkId: string, uid: string) {
    console.log(`El valor de uid es: ${uid}`);
    console.log('🔗 linkId:', linkId);

    this.redirectService.getRedirectByIdWithoutUserIdAndQueryParameter(url, linkId, uid).subscribe({
      next: (response) => {
        console.log('Redirect obtenido:', response);
      },
      error: (error) => {
        console.error('Error al obtener redirect:', error);
      }
    });
  }

  getStrokeDashOffset(): number {
    const currentValue = this.counter();
    return (currentValue / COUNTER_REDIRECT) * this.CIRCUMFERENCE;
  }

  getProgressPercentage(): number {
    return ((COUNTER_REDIRECT - this.counter()) / COUNTER_REDIRECT) * 100;
  }

  redirectNow(): void {
    if (isPlatformBrowser(this.platformId) && this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  }

  cancelRedirect(): void {
    if (isPlatformBrowser(this.platformId) && this.countdownInterval) {
      this.pauseRedirect.update((prev: boolean) => !prev)
      clearInterval(this.countdownInterval)
    }
  }

  togglePause(): void {
    this.pauseRedirect.update((prev: boolean) => !prev)

    if (this.pauseRedirect()) {
      clearInterval(this.countdownInterval)
    } else {
      this.startCountDown()
    }
  }
}

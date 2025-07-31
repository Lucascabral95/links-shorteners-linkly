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
import { ModalLinkPasswordComponentComponent } from "../../../links/components/modal-link-password/modal-link-password-component/modal-link-password-component.component";
import { SeoService } from '../../../../core/services/seo.service';

const COUNTER_REDIRECT = environment.DIRECT_LINK

@Component({
  selector: 'app-redirect',
  imports: [ErrorRedirectComponent, ModalLinkPasswordComponentComponent],
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
  seoService = inject(SeoService)

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
  url = signal<string>('')
  noPassword = signal<boolean>(false)

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['code']
    const uid = this.route.snapshot.queryParamMap.get('uid') || null;
    this.idCurrent.set(paramId)
    this.uid.set(uid)

    if (isPlatformBrowser(this.platformId)) {
      this.seoService.setRedirectSEO();
    }

    if (isPlatformBrowser(this.platformId)) {
      this.startCountDown()
      this.linkService.verifyPasswordOfLinkGet(this.idCurrent()!).subscribe({
        next: () => {
          this.noPassword.set(false)
        },
        error: () => {
          console.log('Error al verificar contraseña')
          this.noPassword.set(true)
        }
      })
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

        if (isPlatformBrowser(this.platformId)) {
          this.seoService.setRedirectSEO(res, this.idCurrent()!);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errors.set({ message: err.error?.message || 'Error desconocido', code: err.status })
        this.loading.set(false)
        this.countdownInterval = clearInterval(this.countdownInterval)
      }
    })

    this.countdownInterval = setInterval(() => {
      this.counter.set(this.counter() - 1)

      if (this.counter() === 0) {
        clearInterval(this.countdownInterval)

        if (this.noPassword() && this.url() !== null && this.uid() !== null) {
          this.redirectService.getRedirectByIdWithoutUserIdAndQueryParameter(this.dataLink()?.originalUrl!, this.idCurrent()!, this.uid()!).subscribe({
            next: () => {
              console.log('Redirect obtenido')
            },
            error: (err: HttpErrorResponse) => {
              console.log('Error al obtener redirect', err)
            }
          })
        } else {
          this.openModalPassword(this.idCurrent()!, this.dataLink()?.originalUrl!, this.uid()!)
        }

        this.loading.set(true)
        this.errors.set({ message: '', code: 0 })
      }
    }, 1000)
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
  // -------
  showModalPassword = signal<boolean>(false)
  linkId = signal<string>('')
  loadingVerifyPassword = signal<boolean>(false)
  errorsVerifyPassword = signal<{ message: string, code: number | null }>({ message: '', code: null })
  responseVerifyPassword = signal<string | null>(null)
  password = signal<string>('')

  openModalPassword(short: string, url: string, uid: string | null) {
    this.showModalPassword.set(true)
    this.linkId.set(short)
    this.url.set(url)
    this.uid.set(uid)
  }

  closeModalPassword() {
    this.linkId.set('')
    this.showModalPassword.set(false)
  }
}

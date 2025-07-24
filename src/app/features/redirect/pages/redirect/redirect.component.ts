import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RedirectService } from '../../service/redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClicksService } from '../../../clicks/service/clicks.service';
import { environment } from '../../../../../environments/environment.development';
import { GetClickByIDInterface } from '../../../clicks/interfaces';
import { HttpErrorResponse } from '@angular/common/http';

// const COUNTER_REDIRECT = environment.DIRECT_LINK
const COUNTER_REDIRECT = 10

@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RedirectComponent implements OnInit, OnDestroy {
  redirectService = inject(RedirectService)
  clickService = inject(ClicksService)
  router = inject(Router)
  route = inject(ActivatedRoute)

  idCurrent = signal<string | null>(null)
  private countdownInterval: any;
  counter = signal<number>(COUNTER_REDIRECT)
  loading = signal<boolean>(false)
  errors = signal<{ message: string, code: number }>({ message: '', code: 0 })
  dataLink = signal<GetClickByIDInterface | null>(null)

  private readonly CIRCUMFERENCE = 339.292;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['id']
    this.idCurrent.set(paramId)

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

    this.clickService.getClickById(this.idCurrent()!).subscribe({
      next: (res: GetClickByIDInterface) => {
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
        console.log('Te estoy redirigiendo')

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
      clearInterval(this.countdownInterval)
    }
  }
}

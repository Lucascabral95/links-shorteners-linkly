import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CardClickComponentComponent } from '../../../../../clicks/components/card-click/card-click-component/card-click-component.component';
import { EmptyArrayComponent } from '../../../../../../shared/components/empty-array/empty-array/empty-array.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationClickInterface } from '../../../../../clicks/interfaces/pagination-click.interface';
import { ClicksService } from '../../../../../clicks/service/clicks.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponentComponent } from "../../../../../../shared/components/loading/loading-component/loading-component.component";
import { ErrorRequestsComponent } from "../../../../../../shared/components/errors/error-requests/error-requests.component";

@Component({
  selector: 'app-clicks-admin-component',
  imports: [CardClickComponentComponent, EmptyArrayComponent, LoadingComponentComponent, ErrorRequestsComponent],
  templateUrl: './clicks-admin-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClicksAdminComponentComponent {
  clicksService = inject(ClicksService)
  authService = inject(AuthService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  loading = signal<boolean>(false)
  private spinnerTimeout!: ReturnType<typeof setTimeout>;
  private errorTimeout!: ReturnType<typeof setTimeout>;
  error = signal<{ message: string, code: number | null }>({ message: '', code: null })

  page = signal(1)
  limit = signal(30)
  country = signal('')
  city = signal('')
  device = signal('')
  browser = signal('')

  quantityPages = signal<number>(0)

  pagesArray = computed(() =>
    Array.from({ length: this.quantityPages() }, (_, i) => i + 1)
  )

  params = computed(() => {
    const params: PaginationClickInterface = {}
    if (this.page() > 1) params.page = this.page()
    if (this.limit() !== 10) params.limit = this.limit()
    if (this.country().trim()) params.country = this.country()
    if (this.city().trim()) params.city = this.city()
    if (this.device().trim()) params.device = this.device()
    if (this.browser().trim()) params.browser = this.browser()
    return params
  })

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['page']) this.page.set(+params['page'])
      if (params['limit']) this.limit.set(+params['limit'])
      if (params['country']) this.country.set(params['country'])
      if (params['city']) this.city.set(params['city'])
      if (params['device']) this.device.set(params['device'])
      if (params['browser']) this.browser.set(params['browser'])
    })

    effect(() => this.loadData())
    effect(() => this.updateUrl())
  }

  private updateUrl(): void {
    const queryParams: PaginationClickInterface = {}
    if (this.page() > 1) queryParams.page = this.page()
    if (this.limit() !== 10) queryParams.limit = this.limit()
    if (this.country().trim()) queryParams.country = this.country()
    if (this.city().trim()) queryParams.city = this.city()
    if (this.device().trim()) queryParams.device = this.device()
    if (this.browser().trim()) queryParams.browser = this.browser()

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    })
  }

  loadData(): void {
    clearTimeout(this.spinnerTimeout);
    clearTimeout(this.errorTimeout);

    this.spinnerTimeout = setTimeout(() => this.loading.set(true), 100);

    this.errorTimeout = setTimeout(() => {
      this.error.set({ message: '', code: null });
    }, 500);

    this.clicksService.getAllClicks(this.params()).subscribe({
      next: resp => {
        clearTimeout(this.spinnerTimeout);
        clearTimeout(this.errorTimeout);
        this.loading.set(false);
        this.quantityPages.set(resp.totalPages);
      },
      error: (err: HttpErrorResponse) => {
        clearTimeout(this.spinnerTimeout);
        clearTimeout(this.errorTimeout);
        this.loading.set(false);
        this.error.set({ message: err.error.message, code: err.status });
      }
    });
  }

  previousPage(): void {
    if (this.page() > 1) this.page.set(this.page() - 1)
  }

  nextPage(): void {
    if (this.page() < this.quantityPages()) this.page.set(this.page() + 1)
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.quantityPages()) this.page.set(page)
  }

  limitOfClicks(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.limit.set(+target.value)

    console.log(`El valor del limit es: ${target.value}`)
  }

  searchDevice(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.page.set(1)
    this.device.set(target.value)
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ErrorRequestsComponent } from "../../../../../../shared/components/errors/error-requests/error-requests.component";
import { LoadingComponentComponent } from "../../../../../../shared/components/loading/loading-component/loading-component.component";
import { CreateLinkModalComponent } from "../../../../../dashboard/components/create-link-modal/create-link-modal/create-link-modal.component";
import { ToastComponentComponent } from "../../../../../../shared/components/toast/toast-component/toast-component.component";
import { UpdateClickModalComponent } from "../../../../../clicks/components/update-click-modal/update-click-modal/update-link-modal.component";
import { EmptyArrayComponent } from "../../../../../../shared/components/empty-array/empty-array/empty-array.component";
import { environment } from '../../../../../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { ParamsLinkInterface } from '../../../../../links/interfaces';
import { take } from 'rxjs';
import { LinksService } from '../../../../../links/service/links.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

const TOAST_TIME = environment.TOAST_TIME;

@Component({
  selector: 'app-links-admin-component',
  imports: [DatePipe, ErrorRequestsComponent, LoadingComponentComponent, CreateLinkModalComponent, ToastComponentComponent, UpdateClickModalComponent, EmptyArrayComponent],
  templateUrl: './links-admin-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LinksAdminComponentComponent {
  linksService = inject(LinksService)
  authService = inject(AuthService)
  loading = signal<boolean>(false)
  private spinnerTimeout!: ReturnType<typeof setTimeout>;
  router = inject(Router)
  route = inject(ActivatedRoute)
  error = signal<{ message: string, code: number }>({ message: '', code: 0 })
  private errorTimeout!: ReturnType<typeof setTimeout>;
  showUpdateModal = signal<boolean>(false)
  linkIdUpdateModal = signal<string | null>(null)

  page = signal(1)
  limit = signal(10)
  isActive = signal<boolean | undefined>(undefined)
  isPublic = signal<boolean | undefined>(undefined)
  category = signal('')
  customAlias = signal('')
  search = signal('')
  quantityPages = signal<number>(0)

  pagesArray = computed(() =>
    Array.from({ length: this.quantityPages() }, (_, i) => i + 1)
  )

  showModal = signal<boolean>(false)

  params = computed(() => {
    const params: ParamsLinkInterface = {}
    if (this.page() > 0) params.page = this.page()
    if (this.limit() > 0) params.limit = this.limit()
    if (this.isActive() !== undefined) params.isActive = this.isActive()
    if (this.isPublic() !== undefined) params.isPublic = this.isPublic()
    if (this.category().trim()) params.category = this.category()
    if (this.customAlias().trim()) params.customAlias = this.customAlias()
    if (this.search().trim()) params.search = this.search()
    return params
  })

  get currentActiveStatus(): string {
    return this.isActive() === undefined ? '' : this.isActive()!.toString()
  }

  constructor() {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['page']) this.page.set(+params['page'])
      if (params['limit']) this.limit.set(+params['limit'])
      if (params['isActive']) this.isActive.set(params['isActive'] === 'true')
      if (params['isPublic']) this.isPublic.set(params['isPublic'] === 'true')
      if (params['category']) this.category.set(params['category'])
      if (params['customAlias']) this.customAlias.set(params['customAlias'])
      if (params['search']) this.search.set(params['search'])
    })

    effect(() => this.updateUrl())
    effect(() => this.loadData())
  }

  private updateUrl(): void {
    const queryParams: ParamsLinkInterface = {}
    if (this.page() > 1) queryParams.page = this.page()
    if (this.limit() !== 10) queryParams.limit = this.limit()
    if (this.isActive() !== undefined) queryParams.isActive = this.isActive()
    if (this.isPublic() !== undefined) queryParams.isPublic = this.isPublic()
    if (this.category().trim()) queryParams.category = this.category()
    if (this.customAlias().trim()) queryParams.customAlias = this.customAlias()
    if (this.search().trim()) queryParams.search = this.search()

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
      this.error.set({ message: '', code: 0 });
    }, 500);

    this.linksService.getAllLinks(this.params()).subscribe({
      next: (resp: any) => {
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

  handleChange(event: Event): void {
    this.limit.set(+(event.target as HTMLInputElement).value)
    this.page.set(1)
  }

  searchCustomAlias(event: Event): void {
    this.customAlias.set((event.target as HTMLInputElement).value.trim())
    this.page.set(1)
  }

  filterStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isActive.set(value === 'true' ? true : value === 'false' ? false : undefined)
    this.page.set(1);
  }

  goToPage(pageNumber: number): void {
    this.page.set(pageNumber)
  }

  previousPage(): void {
    if (this.page() > 1) this.page.set(this.page() - 1)
  }

  nextPage(): void {
    if (this.page() < this.quantityPages()) this.page.set(this.page() + 1)
  }

  toastShow = signal<boolean>(false)
  toastMessage = signal<string>('')
  toastSuccessOrError = signal<'success' | 'error'>('error')

  deleteLink(linkId: string): void {
    this.linksService.deleteLink(linkId).subscribe({
      next: () => {
        this.loadData();
        this.toastShow.set(true)
        this.toastMessage.set('Enlace eliminado correctamente')
        this.toastSuccessOrError.set('success')
        setTimeout(() => {
          this.toastShow.set(false)
        }, TOAST_TIME)
      },
      error: (err: HttpErrorResponse) => {
        this.toastShow.set(true)
        this.toastMessage.set('Error al eliminar el enlace')
        this.toastSuccessOrError.set('error')
        setTimeout(() => {
          this.toastShow.set(false)
        }, TOAST_TIME)
      }
    });
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link)
    this.toastShow.set(true)
    this.toastMessage.set('Enlace copiado correctamente')
    this.toastSuccessOrError.set('success')
    setTimeout(() => {
      this.toastShow.set(false)
    }, TOAST_TIME)
  }

  openUpdateModal(linkId: string) {
    if (!linkId) return;

    this.linkIdUpdateModal.set(linkId);
    this.showUpdateModal.set(true);
  }
}

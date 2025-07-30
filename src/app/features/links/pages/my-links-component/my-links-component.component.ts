import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { LinksService } from '../../service/links.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParamsLinkInterface } from '../../interfaces';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { ToastComponentComponent } from "../../../../shared/components/toast/toast-component/toast-component.component";
import { UpdateClickModalComponent } from "../../../clicks/components/update-click-modal/update-click-modal/update-link-modal.component";
import { CreateLinkModalComponent } from "../../../dashboard/components/create-link-modal/create-link-modal/create-link-modal.component";
import { DatePipe } from '@angular/common';
import { EmptyArrayComponent } from "../../../../shared/components/empty-array/empty-array/empty-array.component";
import { LoadingComponentComponent } from "../../../../shared/components/loading/loading-component/loading-component.component";
import { ErrorRequestsComponent } from "../../../../shared/components/errors/error-requests/error-requests.component";
import { ClicksService } from '../../../clicks/service/clicks.service';

const TOAST_TIME = environment.TOAST_TIME
const MY_FRONTEND = environment.MY_FRONTEND_URL_REDIRECT

@Component({
  imports: [ToastComponentComponent, UpdateClickModalComponent, CreateLinkModalComponent, DatePipe, EmptyArrayComponent, LoadingComponentComponent, ErrorRequestsComponent, RouterLink],
  templateUrl: './my-links-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyLinksComponentComponent {
  linksService = inject(LinksService)
  authService = inject(AuthService)
  clickService = inject(ClicksService)
  loading = signal<boolean>(false)
  private spinnerTimeout!: ReturnType<typeof setTimeout>;
  router = inject(Router)
  route = inject(ActivatedRoute)
  error = signal<{ message: string, code: number }>({ message: '', code: 0 })
  private errorTimeout!: ReturnType<typeof setTimeout>;
  showUpdateModal = signal<boolean>(false)
  linkIdUpdateModal = signal<string | null>(null)
  myFrontend = MY_FRONTEND

  page = signal(1)
  limit = signal(10)
  isActive = signal<boolean | undefined>(undefined)
  isPublic = signal<boolean | undefined>(undefined)
  category = signal('')
  customAlias = signal('')
  search = signal('')
  quantityPages = signal<number>(0)
  userId = signal(this.authService.getUserId()!)
  title = signal('')

  pagesArray = computed(() =>
    Array.from({ length: this.quantityPages() }, (_, i) => i + 1)
  )

  showModal = signal<boolean>(false)

  isLinkExpired(expiresAt: Date | string | null | undefined): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  params = computed(() => {
    const params: ParamsLinkInterface = {}
    if (this.page() > 0) params.page = this.page()
    if (this.limit() > 0) params.limit = this.limit()
    if (this.isActive() !== undefined) params.isActive = this.isActive()
    if (this.isPublic() !== undefined) params.isPublic = this.isPublic()
    if (this.category().trim()) params.category = this.category()
    if (this.customAlias().trim()) params.customAlias = this.customAlias()
    if (this.search().trim()) params.search = this.search()
    if (this.title().trim()) params.title = this.title()
    if (this.userId()) params.userId = this.userId()
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
      if (params['title']) this.title.set(params['title'])
      if (params['userId']) this.userId.set(params['userId'])
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
    if (this.title().trim()) queryParams.title = this.title()
    if (this.userId()) queryParams.userId = this.userId()

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

  searchTitle(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim()
    this.title.set(value)
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

  copyLink(shortCode: string): void {
    const linkToCopy = MY_FRONTEND + '/' + shortCode
    navigator.clipboard.writeText(linkToCopy)
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

  openLink(shortCode: string, uid: string | null) {
    this.router.navigate(['/r', shortCode],
      {
        queryParams: {
          uid: uid
        }
      })
  }
}

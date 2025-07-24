import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableUsersComponentComponent } from "../../../../components/table-users/table-users-component/table-users-component.component";
import { UsersServices } from '../../../../service/user.service';
import { GetAllUsersInterface } from '../../../../interfaces';
import { Role } from '../../../../../auth/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsUsersInterface } from '../../../../interfaces/params-users.interface';
import { ErrorRequestsComponent } from "../../../../../../shared/components/errors/error-requests/error-requests.component";
import { EmptyArrayComponent } from "../../../../../../shared/components/empty-array/empty-array/empty-array.component";

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, TableUsersComponentComponent, ErrorRequestsComponent, EmptyArrayComponent],
  templateUrl: './users-admin-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersAdminComponent {
  userService = inject(UsersServices)
  router = inject(Router)
  route = inject(ActivatedRoute)

  isLoading = signal<boolean>(false)
  error = signal<{ message: string | null, code: number } | null>(null)

  page = signal<number>(1)
  limit = signal<number>(10)
  full_name = signal<string | null>(null)
  role = signal<Role | null>(null)
  provider = signal<string | null>(null)
  verified = signal<boolean | null>(null)

  quantityPages = computed(() => this.userService.usersList()?.totalPages || 1)
  arrayEmpty = computed(() => this.userService.usersList()?.users?.length === 0)

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.page.set(Number(params.get('page') || 1))
      this.limit.set(Number(params.get('limit') || 10))
      this.full_name.set(params.get('full_name') || null)
      this.role.set(params.get('role') as Role || null)
      this.provider.set(params.get('provider') || null)
      this.verified.set(params.get('verified') === 'true' || null)
    })

    effect(() => {
      this.loadUsers()
    })

    effect(() => {
      this.updateRoutes()
    })
  }

  loadUsers(): void {
    this.isLoading.set(true)
    this.error.set({ message: null, code: 0 })

    this.userService.getAllUsers({
      page: this.page(),
      limit: this.limit(),
      full_name: this.full_name() || undefined,
      role: this.role() || undefined,
      provider: this.provider() || undefined,
      verified: this.verified() || undefined
    }).subscribe({
      next: (response: GetAllUsersInterface) => {
        this.isLoading.set(false)
        this.userService.usersList.set(response)
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false)
        this.error.set({ message: error.error.message, code: error.status })
      }
    })
  }

  updateRoutes(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page(),
        limit: this.limit(),
        full_name: this.full_name() || undefined,
        role: this.role() || undefined,
        provider: this.provider() || undefined,
        verified: this.verified() || undefined
      },
      queryParamsHandling: 'merge'
    })
  }

  pagesArray(): number[] {
    const totalPages = this.userService.usersList()?.totalPages || 1
    const currentPage = this.page()
    const pages: number[] = []

    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1)
      this.updateRoutes()
    }
  }

  nextPage(): void {
    if (this.userService.usersList()?.totalPages && this.page() < this.userService.usersList()!.totalPages) {
      this.page.set(this.page() + 1)
      this.updateRoutes()
    }
  }

  goToPage(pageNumber: number): void {
    if (this.userService.usersList()?.totalPages && pageNumber > 0 && pageNumber <= this.userService.usersList()!.totalPages && pageNumber !== this.page()) {
      this.page.set(pageNumber)
      this.updateRoutes()
    }
  }

  updateFilters(newParams: ParamsUsersInterface) {
    this.page.set(newParams.page || 1)
    this.limit.set(newParams.limit || 10)
    this.full_name.set(newParams.full_name || null)
    this.role.set(newParams.role || null)
    this.provider.set(newParams.provider || null)
    this.verified.set(newParams.verified || null)
    this.updateRoutes()
  }

  searchFullName(fullName: Event) {
    const target = fullName.target as HTMLInputElement;
    this.updateFilters({ full_name: target.value })
  }

  filterByRole(role: Event) {
    const target = role.target as HTMLSelectElement;
    this.updateFilters({ role: target.value as Role })
  }

  deleteUserById(id: string): void {
    this.userService.deleteUserById(id).subscribe({
      next: () => {
        console.log('Usuario eliminado')
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.status)
      }
    })
  }

}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminComponent {
  authServie = inject(AuthService)
  adminService = inject(AdminService)
  payload = signal(this.authServie.getPayloadJWT())

  isLoading = signal<boolean>(true)
  error = signal<{ message: string | null, code: number }>({ message: null, code: 0 })

  analyticsData = toSignal(
    this.adminService.getAllData().pipe(
      tap(() => {
        this.isLoading.set(false)
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        this.isLoading.set(false)
        this.error.set({ message: error.error.message, code: error.status })
        return of(null)
      })
    ),
    { initialValue: null }
  )

  quantityUsers = computed(() => {
    return this.analyticsData()?.totalUsers || 0
  })

  quantityLinks = computed(() => {
    return this.analyticsData()?.totalLinks || 0
  })

  quantityClicks = computed(() => {
    return this.analyticsData()?.totalClicks || 0
  })


  ngOnInit(): void {
    this.payload()
  }
}

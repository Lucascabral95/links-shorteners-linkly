import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import AnalytitcsGeneralComponentComponent from "../../../../components/analytics-sections/analytitcs-general-component/analytitcs-general-component.component";
import { AnalyticsLinksTopsComponentComponent } from "../../../../components/analytics-sections/analytics-links-tops-component/analytics-links-tops-component.component";
import { AnalyticsGeographicComponentComponent } from "../../../../components/analytics-sections/analytics-geographic-component/analytics-geographic-component/analytics-geographic-component.component";
import { ErrorRequestsComponent } from "../../../../../../shared/components/errors/error-requests/error-requests.component";
import { AdminService } from '../../../../service/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponentComponent } from "../../../../../../shared/components/loading/loading-component/loading-component.component";

@Component({
  selector: 'app-analytics-admin-component',
  standalone: true,
  imports: [AnalytitcsGeneralComponentComponent, AnalyticsLinksTopsComponentComponent, AnalyticsGeographicComponentComponent, ErrorRequestsComponent, LoadingComponentComponent],
  templateUrl: './analytics-admin-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalyticsAdminComponent implements OnInit {
  adminService = inject(AdminService)
  errors = signal<{ message: string, code: number | null }>({ message: '', code: null })
  loading = signal<boolean>(false)

  ngOnInit(): void {
    this.errors.set({ message: '', code: null })
    this.loading.set(true)

    this.adminService.getConversionRate().subscribe({
      next: () => {
        this.errors.set({ message: '', code: null })
        this.loading.set(false)
      },
      error: (err: HttpErrorResponse) => {
        this.errors.set({ message: err.error.message, code: err.status })
        this.loading.set(false)
      }
    })
  }
}

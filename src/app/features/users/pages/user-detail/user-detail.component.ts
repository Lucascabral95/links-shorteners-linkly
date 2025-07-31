import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationService } from '../../../configuration/service/configuration.service';
import { LoadingComponentComponent } from "../../../../shared/components/loading/loading-component/loading-component.component";
import { ErrorRequestsComponent } from "../../../../shared/components/errors/error-requests/error-requests.component";
import { GetUsersInterface } from '../../../configuration/interfaces/get-user.interface';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponentComponent, ErrorRequestsComponent, DatePipe],
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailComponent implements OnInit {
  configurationService = inject(ConfigurationService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  seoService = inject(SeoService)
  platformId = inject(PLATFORM_ID)

  currentId = signal<string | null>(null)
  userData = signal<GetUsersInterface | null>(null)

  loading = signal<boolean>(false)
  errors = signal<{ message: string | null, status: number | null }>({ message: null, status: null })

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.seoService.setUserDetailSEO()
    }

    const currentRoute = this.route.snapshot.params['id']
    this.currentId.set(currentRoute)
    console.log(currentRoute)
    this.loading.set(true)
    this.errors.set({ message: null, status: null })

    this.configurationService.getUserById(currentRoute).subscribe({
      next: (user) => {
        this.loading.set(false)
        this.userData.set(user)
        console.log(this.userData())
      },
      error: (error) => {
        console.log(error)
        this.errors.set({ message: error.message, status: error.status })
      }
    })

  }

}

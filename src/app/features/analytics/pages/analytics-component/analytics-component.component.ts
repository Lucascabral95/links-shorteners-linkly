import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { GetClicksInterface } from '../../../clicks/interfaces';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

declare var ApexCharts: any;

@Component({
  selector: 'app-analytics-component',
  imports: [CommonModule],
  templateUrl: './analytics-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalyticsComponentComponent {
  analyticsService = inject(AnalyticsService);
  loading = signal(true);
  data = signal<GetClicksInterface | null>(null);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.analyticsService.getAnalyticsById(this.authService.getUserId()!).subscribe();
  }

}

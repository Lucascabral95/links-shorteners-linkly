import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
export default class AnalyticsComponentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('analytics') analytics: any;
  analyticsService = inject(AnalyticsService);
  loading = signal(true);
  data = signal<GetClicksInterface | null>(null);
  authService = inject(AuthService);

  chart: any;

  ngAfterViewInit(): void {
    this.analyticsService.getAnalyticsById(this.authService.getUserId()!).subscribe();
    this.createChart([1, 2, 3, 4, 5, 6], ['a', 'b', 'c', 'd', 'e', 'f']);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(data: number[], categories: string[]): void {
    var options = {
      series: [{
        data: data
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
      },
      colors: ['#1f77b4'],
      title: {
        text: 'Distribución de países',
        style: {
          color: '#1f77b4',
        }
      },
      tooltip: {
        theme: 'dark',
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const cityCountry = w.globals.labels[dataPointIndex];
          const value = series[seriesIndex][dataPointIndex];

          return `
            <div class="arrow_box" style="padding: 8px 12px; background: #333; color: #fff; border-radius: 4px;">
              <span>${cityCountry}: ${value}</span>
            </div>
          `;
        }
      }
    }

    var chart = new ApexCharts(this.analytics.nativeElement, options);
    chart.render();
    this.chart = chart;
  }
}

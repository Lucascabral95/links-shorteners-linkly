import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { GetGeneralAnalyticsInterface } from '../../../interfaces/admin';

declare var ApexCharts: any;

@Component({
  selector: 'analytics-general-component',
  standalone: true,
  imports: [],
  templateUrl: './analytitcs-general-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalytitcsGeneralComponentComponent implements AfterViewInit, OnDestroy {
  adminService = inject(AdminService)
  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;

  private charts: any[] = [];

  data = signal<GetGeneralAnalyticsInterface>({
    totalLinks: 0,
    totalClicks: 0,
    totalUsers: 0,
    totalPremiumUsers: 0,
    totalFreeUsers: 0,
    totalGuestUsers: 0,
    totalAdminUsers: 0,
    distributionUsers: [
      { _count: { role: 0 }, role: "ADMIN" },
      { _count: { role: 0 }, role: "PREMIUM" },
      { _count: { role: 0 }, role: "FREE" },
      { _count: { role: 0 }, role: "GUEST" },
    ]
  });

  clickRate = signal<number>(0);
  premiumRate = signal<number>(0);

  ngAfterViewInit(): void {
    this.adminService.getAllData().subscribe((res: GetGeneralAnalyticsInterface) => {
      this.data.set(res);
      this.calculateRates();

      setTimeout(() => {
        this.createDonutChart();
        this.createBarChart();
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart?.destroy());
  }

  private calculateRates(): void {
    const analytics = this.data();
    const clickRate = analytics.totalLinks > 0
      ? (analytics.totalClicks / analytics.totalLinks) * 100
      : 0;
    const premiumRate = analytics.totalUsers > 0
      ? (analytics.totalPremiumUsers / analytics.totalUsers) * 100
      : 0;

    this.clickRate.set(Math.round(clickRate));
    this.premiumRate.set(Math.round(premiumRate));
  }

  private createDonutChart(): void {
    const analytics = this.data();

    const donutOptions = {
      series: analytics.distributionUsers.map(item => item._count.role),
      chart: {
        type: 'donut',
        height: 380
      },
      labels: analytics.distributionUsers.map(item => item.role),
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Users',
                fontSize: '16px',
                fontWeight: 600,
                formatter: () => analytics.totalUsers.toString()
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px'
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} users`
        }
      }
    };

    const donutChart = new ApexCharts(this.donutChart.nativeElement, donutOptions);
    donutChart.render();
    this.charts.push(donutChart);
  }

  private createBarChart(): void {
    const analytics = this.data();

    const barOptions = {
      series: [{
        name: 'Cantidad',
        data: [analytics.totalLinks, analytics.totalClicks, analytics.totalUsers]
      }],
      chart: {
        type: 'bar',
        height: 320
      },
      xaxis: {
        categories: ['Total Links', 'Total Clicks', 'Total Users']
      },
      colors: ['#667EEA'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '60%'
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      yaxis: {
        beginAtZero: true
      }
    };

    const barChart = new ApexCharts(this.barChart.nativeElement, barOptions);
    barChart.render();
    this.charts.push(barChart);
  }
}

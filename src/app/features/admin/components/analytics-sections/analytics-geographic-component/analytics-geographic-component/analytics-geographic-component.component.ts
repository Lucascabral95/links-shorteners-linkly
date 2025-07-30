import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild, OnDestroy, AfterViewInit, computed } from '@angular/core';
import { AdminService } from '../../../../service/admin.service';
import { GetAnalyticsGeographicInterface } from '../../../../interfaces/admin';

declare var ApexCharts: any;
const MAX_CATEGORIES = 6;

@Component({
  selector: 'analytics-geographic-component',
  imports: [],
  templateUrl: './analytics-geographic-component.component.html',
  styleUrls: ['./analytics-geographic.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsGeographicComponentComponent implements AfterViewInit, OnDestroy {
  private adminService = inject(AdminService)
  @ViewChild('chartDiv') chartDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('chartDiv2') chartDiv2!: ElementRef<HTMLDivElement>;
  @ViewChild('chartDiv3') chartDiv3!: ElementRef<HTMLDivElement>;
  @ViewChild('chartDiv4') chartDiv4!: ElementRef<HTMLDivElement>;

  chart: any;
  chart2: any;
  chart3: any;
  chart4: any;
  data = signal<GetAnalyticsGeographicInterface | null>(null);

  geographicDistribution = computed(() => {
    if (!this.data()) return null;
    return this.data()
  })

  ngAfterViewInit(): void {
    this.adminService.getAnalyticsGeographic().subscribe((res: GetAnalyticsGeographicInterface) => {
      this.data.set(res)

      const countries = res.countries.map(i => i.country ?? 'Unknown').slice(0, MAX_CATEGORIES)
      const quantityCountries = res.countries.map(i => i._count.country).slice(0, MAX_CATEGORIES)
      this.createChart(quantityCountries, countries)

      const cities = res.cities.map(i => i.city ?? 'Unknown').slice(0, MAX_CATEGORIES)
      const quantityCities = res.cities.map(i => i._count.city).slice(0, MAX_CATEGORIES)
      this.createChart2(quantityCities, cities)

      const devices = res.devices.map(i => i.device ?? 'Unknown').slice(0, MAX_CATEGORIES)
      const quantityDevices = res.devices.map(i => i._count.device).slice(0, MAX_CATEGORIES)
      this.createChart3(quantityDevices, devices)

      const browsers = res.browsers.map(i => i.browser ?? 'Unknown').slice(0, MAX_CATEGORIES)
      const quantityBrowsers = res.browsers.map(i => i._count.browser).slice(0, MAX_CATEGORIES)
      this.createChart4(quantityBrowsers, browsers)
    })
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.chart2) {
      this.chart2.destroy();
      this.chart2 = null;
    }
    if (this.chart3) {
      this.chart3.destroy();
      this.chart3 = null;
    }
    if (this.chart4) {
      this.chart4.destroy();
      this.chart4 = null;
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

    var chart = new ApexCharts(this.chartDiv.nativeElement, options);
    chart.render();
    this.chart = chart;
  }

  private createChart2(data: number[], categories: string[]): void {
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
        text: 'Distribución de ciudades',
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
    };

    var chart = new ApexCharts(this.chartDiv2.nativeElement, options);
    chart.render();
    this.chart2 = chart;
  }

  private createChart3(data: number[], categories: string[]): void {
    var options = {
      series: data,
      chart: {
        type: 'donut',
      },
      labels: categories,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      title: {
        text: 'Distribución de dispositivos',
        style: {
          color: '#1f77b4',
        }
      }
    };

    var chart = new ApexCharts(this.chartDiv3.nativeElement, options);
    chart.render();
    this.chart3 = chart;
  }

  private createChart4(data: number[], categories: string[]): void {
    var options = {
      series: data,
      chart: {
        type: 'donut',
      },
      labels: categories,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#45B7D1', '#45B7D1', '#45B7D1'],
      title: {
        text: 'Distribución de navegadores',
        style: {
          color: '#1f77b4',
        }
      }
    };

    var chart = new ApexCharts(this.chartDiv4.nativeElement, options);
    chart.render();
    this.chart4 = chart;
  }
}

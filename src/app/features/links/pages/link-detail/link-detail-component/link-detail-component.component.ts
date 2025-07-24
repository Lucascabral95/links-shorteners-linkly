import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../../../service/links.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetStatsLinkByIDInterface } from '../../../interfaces/get-stats-link-by-id.interface';

declare var ApexCharts: any;

const MAX_CATEGORIES = 5;

@Component({
  selector: 'app-link-detail-component',
  imports: [],
  standalone: true,
  templateUrl: './link-detail-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LinkDetailComponentComponent implements OnDestroy {
  @ViewChild('chartCountries', { static: false }) chartCountries!: ElementRef<HTMLDivElement>;
  @ViewChild('chartCities', { static: false }) chartCities!: ElementRef<HTMLDivElement>;
  @ViewChild('chartDevices', { static: false }) chartDevices!: ElementRef<HTMLDivElement>;
  @ViewChild('chartBrowsers', { static: false }) chartBrowsers!: ElementRef<HTMLDivElement>;
  router = inject(Router)
  route = inject(ActivatedRoute)
  linkService = inject(LinksService)

  chart: any = null;
  chart2: any = null;
  chart3: any = null;
  chart4: any = null;

  linkId = signal<string | null>(null)
  loading = signal<boolean>(false)
  errors = signal<{ message: string | null, code: number }>({ message: null, code: 0 })
  linkData = signal<GetStatsLinkByIDInterface | null>(null)

  ngAfterViewInit(): void {
    const currentId = this.route.snapshot.params['id']
    this.linkId.set(currentId)
    this.loading.set(true)
    this.errors.set({ message: null, code: 0 })

    this.linkService.getStatsOfLink(currentId).subscribe({
      next: (res: GetStatsLinkByIDInterface) => {
        this.loading.set(false)
        this.linkData.set(res)

        console.log(res)
        const countriesNumber = res?.countries.map((country) => country?._count.country ?? 0).slice(0, MAX_CATEGORIES)
        const countriesData = res?.countries.map((country) => country?.country ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartCountry(countriesNumber, countriesData);

        const citiesNumber = res?.cities.map((city) => city?._count.city ?? 0).slice(0, MAX_CATEGORIES)
        const citiesData = res?.cities.map((city) => city?.city ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartCity(citiesNumber, citiesData);

        const devicesNumber = res?.devices.map((device) => device?._count.device ?? 0).slice(0, MAX_CATEGORIES)
        const devicesData = res?.devices.map((device) => device?.device ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartDevice(devicesNumber, devicesData);

        const browsersNumber = res?.browsers.map((browser) => browser?._count.browser ?? 0).slice(0, MAX_CATEGORIES)
        const browsersData = res?.browsers.map((browser) => browser?.browser ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartBrowser(browsersNumber, browsersData);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false)
        this.errors.set({ message: err.error.message, code: err.status })
      }
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

  createChartCountry(data: number[], data2: string[]): void {
    const options = {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%'
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      },
      series: [{
        name: 'Visitas',
        data: data
      }],
      xaxis: {
        categories: data2
      },
      theme: {
        palette: 'palette10'
      },
      dataLabels: {
        style: {
          colors: ['#000000']
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      title: {
        text: 'Top visitas por país',
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

    try {
      this.chart = new ApexCharts(this.chartCountries.nativeElement, options);
      this.chart.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartCity(data: number[], data2: string[]): void {
    const options = {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%'
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      },
      series: [{
        name: 'Visitas',
        data: data
      }],
      xaxis: {
        categories: data2
      },
      theme: {
        palette: 'palette10'
      },
      dataLabels: {
        style: {
          colors: ['#000000']
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      title: {
        text: 'Top visitas por ciudad',
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

    try {
      this.chart2 = new ApexCharts(this.chartCities.nativeElement, options);
      this.chart2.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartDevice(data: number[], data2: string[]): void {
    const options = {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%'
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      },
      series: [{
        name: 'Visitas',
        data: data
      }],
      xaxis: {
        categories: data2
      },
      theme: {
        palette: 'palette10'
      },
      dataLabels: {
        style: {
          colors: ['#000000']
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      title: {
        text: 'Top visitas por dispositivo',
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

    try {
      this.chart3 = new ApexCharts(this.chartDevices.nativeElement, options);
      this.chart3.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartBrowser(data: number[], data2: string[]): void {
    const options = {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%'
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      },
      series: [{
        name: 'Visitas',
        data: data
      }],
      xaxis: {
        categories: data2
      },
      theme: {
        palette: 'palette10'
      },
      dataLabels: {
        style: {
          colors: ['#000000']
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      title: {
        text: 'Top visitas por navegador',
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

    try {
      this.chart4 = new ApexCharts(this.chartBrowsers.nativeElement, options);
      this.chart4.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }


}

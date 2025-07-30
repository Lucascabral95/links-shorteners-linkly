import { ChangeDetectionStrategy, Component, ElementRef, inject, AfterViewInit, signal, ViewChild } from '@angular/core';
import { ClicksService } from '../../../service/clicks.service';
import { GetClickStatsByIDInterface } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ErrorRequestDetailComponent } from '../../../../../shared/components/errors/error-request-detail/error-request-detail/error-request-detail.component';
import { ChartHelpers } from '../../../../../shared/utils/helpers/chart.analytics-personals';

declare var ApexCharts: any;
const MAX_CATEGORIES = 5;

@Component({
  selector: 'app-click-detail',
  imports: [DatePipe, ErrorRequestDetailComponent],
  templateUrl: './click-detail-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClickDetailComponentComponent implements AfterViewInit {
  @ViewChild('chartCountries') countriesChart!: ElementRef<HTMLDivElement>
  @ViewChild('citiesChart') citiesChart!: ElementRef<HTMLDivElement>
  @ViewChild('devicesChart') devicesChart!: ElementRef<HTMLDivElement>
  @ViewChild('browsersChart') browsersChart!: ElementRef<HTMLDivElement>

  clickService = inject(ClicksService)
  route = inject(ActivatedRoute)
  getInnerHtml = ChartHelpers

  chartCountries: any = null
  chartCities: any = null
  chartDevices: any = null
  chartBrowsers: any = null

  clickId = signal<string>('')
  dataClick = signal<GetClickStatsByIDInterface | null>(null)
  errors = signal<{ message: string | null, code: number }>({ message: null, code: 0 })

  ngAfterViewInit(): void {
    this.clickId.set(this.route.snapshot.params['id'] as string)
    this.errors.set({ message: null, code: 0 })

    this.clickService.getStatsOfClick(this.clickId()).subscribe({
      next: (resp: GetClickStatsByIDInterface) => {
        this.dataClick.set(resp)

        const dataCountries = resp.metrics.byCountry.map((country) => country.count).slice(0, MAX_CATEGORIES)
        const dataCountriesNames = resp.metrics.byCountry.map((country) => country.country ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartCountry(dataCountries, dataCountriesNames)

        const dataCities = resp.metrics.byCity.map((city) => city.count).slice(0, MAX_CATEGORIES)
        const dataCitiesNames = resp.metrics.byCity.map((city) => city.city ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartCity(dataCities, dataCitiesNames)

        const dataDevices = resp.metrics.byDevice.map((device) => device.count).slice(0, MAX_CATEGORIES)
        const dataDevicesNames = resp.metrics.byDevice.map((device) => device.device ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartDevice(dataDevices, dataDevicesNames)

        const dataBrowsers = resp.metrics.byBrowser.map((browser) => browser.count).slice(0, MAX_CATEGORIES)
        const dataBrowsersNames = resp.metrics.byBrowser.map((browser) => browser.browser ?? 'Unknown').slice(0, MAX_CATEGORIES)
        this.createChartBrowser(dataBrowsers, dataBrowsersNames)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.errors.set({ message: err.error.message, code: err.status })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.chartCountries) {
      this.chartCountries.destroy();
      this.chartCountries = null;
    }
    if (this.chartCities) {
      this.chartCities.destroy();
      this.chartCities = null;
    }
    if (this.chartDevices) {
      this.chartDevices.destroy();
      this.chartDevices = null;
    }
    if (this.chartBrowsers) {
      this.chartBrowsers.destroy();
      this.chartBrowsers = null;
    }
  }

  createChartCountry(data: number[], data2: string[]): void {
    const chartContainer = this.countriesChart.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.getInnerHtml.getNoDataMessageHTML(
        "Distribución de enlaces y clicks",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

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
        name: 'Clicks',
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
        text: 'Top clicks por país',
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
      this.chartCountries = new ApexCharts(this.countriesChart.nativeElement, options);
      this.chartCountries.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartCity(data: number[], data2: string[]): void {
    const chartContainer = this.citiesChart.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.getInnerHtml.getNoDataMessageHTML(
        "Distribución de enlaces y clicks",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

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
        name: 'Clicks',
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
        text: 'Top clicks por país',
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
      this.chartCities = new ApexCharts(this.citiesChart.nativeElement, options);
      this.chartCities.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartDevice(data: number[], data2: string[]): void {
    const chartContainer = this.devicesChart.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.getInnerHtml.getNoDataMessageHTML(
        "Distribución de enlaces y clicks",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

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
        name: 'Clicks',
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
        text: 'Top clicks por dispositivo',
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
      this.chartDevices = new ApexCharts(this.devicesChart.nativeElement, options);
      this.chartDevices.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

  createChartBrowser(data: number[], data2: string[]): void {
    const chartContainer = this.browsersChart.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.getInnerHtml.getNoDataMessageHTML(
        "Distribución de enlaces y clicks",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

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
        name: 'Clicks',
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
        text: 'Top clicks por navegador',
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
      this.chartBrowsers = new ApexCharts(this.browsersChart.nativeElement, options);
      this.chartBrowsers.render();
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }

}

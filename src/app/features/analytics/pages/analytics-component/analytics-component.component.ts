import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { GetUserDataByIDInterface } from '../../interfaces/get-user-data-by-id.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorRequestDetailComponent } from "../../../../shared/components/errors/error-request-detail/error-request-detail/error-request-detail.component";
import { ChartHelpers } from '../../../../shared/utils/helpers/chart.analytics-personals';

declare var ApexCharts: any;

@Component({
  selector: 'app-analytics-component',
  imports: [CommonModule, ErrorRequestDetailComponent],
  templateUrl: './analytics-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalyticsComponentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('analytics', { static: false }) chartOne!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics2', { static: false }) chartTwo!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics3', { static: false }) chartThree!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics4', { static: false }) chartFour!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics5', { static: false }) chartFive!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics6', { static: false }) chartSix!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics7', { static: false }) chartSeven!: ElementRef<HTMLDivElement>;
  @ViewChild('analytics8', { static: false }) chartEight!: ElementRef<HTMLDivElement>;

  analyticsService = inject(AnalyticsService);
  authService = inject(AuthService);
  chartHelpers = ChartHelpers;

  chart: any = null;
  chart2: any = null;
  chart3: any = null;
  chart4: any = null;
  chart5: any = null;
  chart6: any = null;
  chart7: any = null;
  chart8: any = null;

  userData = signal<GetUserDataByIDInterface | null>(null);
  errors = signal<{ message: string | null, code: number }>({ message: null, code: 0 });

  ngAfterViewInit(): void {
    this.analyticsService.getUserDataByIdAnalytics(this.authService.getUserId()!).subscribe({
      next: (res: GetUserDataByIDInterface) => {
        this.userData.set(res);

        const distributionForCreationLinksAndClicks = [res.stats.quantityClicks, res.stats.quantityLinks];
        const distributionForCreationLinkCategories = ['Total de clicks', 'Total de enlaces'];
        this.createChart(distributionForCreationLinksAndClicks, distributionForCreationLinkCategories);

        const topLinksData = this.chartHelpers.getTopLinksByClicks(res);
        const topLinksDataLabels = res.data.links.map(link => link.title);
        this.createChart2(topLinksData.values, topLinksDataLabels);

        const countryData = this.chartHelpers.getClicksByCountry(res);
        this.createChart3(countryData.values, countryData.labels);

        const deviceData = this.chartHelpers.getClicksByDevice(res);
        this.createChart4(deviceData.values, deviceData.labels);

        const clicksOverTimeData = this.chartHelpers.getClicksOverTime(res);
        this.createChart5(clicksOverTimeData.dates, clicksOverTimeData.counts);

        const categoryClicksData = this.chartHelpers.getClicksByCategory(res);
        this.createChart6(categoryClicksData.values, categoryClicksData.labels);

        const browserClicksData = this.chartHelpers.getClicksByBrowser(res);
        this.createChart7(browserClicksData.values, browserClicksData.labels);

        const linkStatusData = this.chartHelpers.getLinkStatusCounts(res);
        this.createChart8(linkStatusData.values, linkStatusData.labels);
      },
      error: (err: HttpErrorResponse) => {
        this.errors.set({ message: err.error.message, code: err.status });
      }
    });
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
    if (this.chart5) {
      this.chart5.destroy();
      this.chart5 = null;
    }
    if (this.chart6) {
      this.chart6.destroy();
      this.chart6 = null;
    }
    if (this.chart7) {
      this.chart7.destroy();
      this.chart7 = null;
    }
    if (this.chart8) {
      this.chart8.destroy();
      this.chart8 = null;
    }
  }

  private createChart(data: number[], categories: string[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const chartContainer = this.chartOne.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Distribución de enlaces y clicks",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const total = data.reduce((sum, value) => sum + value, 0);

    const donutOptions = {
      series: data,
      chart: {
        type: 'donut',
        height: 380,
        background: '#ffffff',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      labels: categories,
      colors: ['#3E66FB', '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A936F'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 700,
                color: '#333'
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '18px',
                fontWeight: 700,
                color: '#444',
                formatter: () => total.toString()
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          width: 12,
          height: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ${val === data[0] ? 'clics' : 'enlaces'}`
        }
      },
      title: {
        text: 'Distribución de enlaces y clicks',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['#fff']
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    this.chart = new ApexCharts(this.chartOne.nativeElement, donutOptions);
    this.chart.render();
  }

  private createChart2(data: number[], categories: string[]): void {
    if (this.chart2) {
      this.chart2.destroy();
    }

    const chartContainer = this.chartTwo.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Top Enlaces",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const options = {
      series: [{
        name: "Clics",
        data: data
      }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Número de Clics',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Enlaces',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      colors: ['#4361ee'],
      title: {
        text: 'Top 10 Enlaces por Clicks',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + " clics";
          }
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      }
    };

    this.chart2 = new ApexCharts(this.chartTwo.nativeElement, options);
    this.chart2.render();
  }

  private createChart3(data: number[], categories: string[]): void {
    if (this.chart3) {
      this.chart3.destroy();
    }

    const chartContainer = this.chartThree.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Distribución de clicks por País",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const options = {
      series: [{
        name: "Clics",
        data: data
      }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Número de Clics',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Países',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      colors: ['#4cc9f0'],
      title: {
        text: 'Distribución de Clics por País',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + " clics";
          }
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      }
    };

    this.chart3 = new ApexCharts(this.chartThree.nativeElement, options);
    this.chart3.render();
  }

  private createChart4(data: number[], categories: string[]): void {
    if (this.chart4) {
      this.chart4.destroy();
    }

    const chartContainer = this.chartFour.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Distribución de clicks por Dispositivo",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const options = {
      series: [{
        name: "Clics",
        data: data
      }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Número de Clics',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Dispositivos',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      colors: ['#7209b7'],
      title: {
        text: 'Distribución de Clics por Dispositivo',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + " clics";
          }
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      }
    };

    this.chart4 = new ApexCharts(this.chartFour.nativeElement, options);
    this.chart4.render();
  }

  private createChart5(categories: string[], data: number[]): void {
    if (this.chart5) {
      this.chart5.destroy();
    }

    const chartContainer = this.chartFive.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Crecimiento de clicks en el Tiempo",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const options = {
      series: [{
        name: "Clics",
        data: data
      }],
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Fecha',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Número de Clicks',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      colors: ['#f72585'],
      title: {
        text: 'Crecimiento de Clics en el Tiempo',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + " clics";
          }
        }
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      }
    };

    this.chart5 = new ApexCharts(this.chartFive.nativeElement, options);
    this.chart5.render();
  }

  private createChart6(data: number[], categories: string[]): void {
    if (this.chart6) {
      this.chart6.destroy();
    }

    const chartContainer = this.chartSix.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Clicks por Categoría de Enlace",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const options = {
      series: [{
        name: "Clics",
        data: data
      }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Categorías',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Número de Clics',
          style: {
            fontSize: '14px',
            fontWeight: 500
          }
        }
      },
      colors: ['#4CAF50'],
      title: {
        text: 'Clicks por Categoría de Enlace',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + " clics";
          }
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      }
    };

    this.chart6 = new ApexCharts(this.chartSix.nativeElement, options);
    this.chart6.render();
  }

  private createChart7(data: number[], categories: string[]): void {
    if (this.chart7) {
      this.chart7.destroy();
    }

    const chartContainer = this.chartSeven.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Distribución de clicks por Categoría",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const total = data.reduce((sum, value) => sum + value, 0);

    const options = {
      series: data,
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      labels: categories,
      colors: ['#FF9F1C', '#2EC4B6', '#E71D36', '#662E9B', '#43BCCD'],
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          width: 12,
          height: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} clics`
        }
      },
      title: {
        text: 'Distribución de Clics por Navegador',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + "%";
        },
        style: {
          fontSize: '12px',
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    this.chart7 = new ApexCharts(this.chartSeven.nativeElement, options);
    this.chart7.render();
  }

  private createChart8(data: number[], categories: string[]): void {
    if (this.chart8) {
      this.chart8.destroy();
    }

    const chartContainer = this.chartEight.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Estado de los enlaces",
        "Aún no hay enlaces registrados. ¡Cada enlace cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

    const total = data.reduce((sum, value) => sum + value, 0);

    const options = {
      series: data,
      chart: {
        type: 'donut',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      labels: categories,
      colors: ['#06D6A0', '#EF476F'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 600
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 700,
                color: '#333'
              },
              total: {
                show: true,
                label: 'Total Enlaces',
                fontSize: '16px',
                fontWeight: 700,
                color: '#444',
                formatter: () => total.toString()
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          width: 12,
          height: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} enlaces`
        }
      },
      title: {
        text: 'Estado de los Enlaces',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: '#2B3A67'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['#fff']
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    this.chart8 = new ApexCharts(this.chartEight.nativeElement, options);
    this.chart8.render();


  }
}

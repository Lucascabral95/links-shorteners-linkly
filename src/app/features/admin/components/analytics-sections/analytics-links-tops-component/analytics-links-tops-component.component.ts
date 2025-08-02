import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
  inject,
  computed
} from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { GetLinksTopInterface } from '../../../interfaces/admin';

declare var ApexCharts: any;

@Component({
  selector: 'analytics-links-tops-component',
  imports: [],
  templateUrl: './analytics-links-tops-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLinksTopsComponentComponent implements AfterViewInit, OnDestroy {
  private adminService = inject(AdminService);
  @ViewChild('chartDiv') chartDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('chartDiv2') chartDiv2!: ElementRef<HTMLDivElement>;

  data = signal<GetLinksTopInterface | null>(null);
  private chart: any = null;

  filterPeriodSelected = signal<string>('90d');

  currentFilterDate = computed(() => {
    switch (this.filterPeriodSelected()) {
      case '1h':
        return 'la última hora';
      case '7d':
        return 'los últimos 7 dias';
      case '30d':
        return 'los últimos 30 dias';
      case '90d':
        return 'los últimos 90 dias';
      case '1y':
        return 'los últimos año';
      default:
        return 'los últimos 90 dias';
    }
  });

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadData(this.filterPeriodSelected());
    }, 100);
  }

  private loadData(period: string): void {
    this.adminService.getLinksTop(period).subscribe({
      next: (res: GetLinksTopInterface) => {
        this.data.set(res);
        this.createChart();
      },
      error: (error) => {
        console.error('Error cargando datos', error);
      }
    });
  }

  private createChart(): void {
    const linksData = this.data();

    if (!linksData?.topLinks?.length) {
      console.log('No hay datos para mostrar');
      return;
    }

    if (typeof ApexCharts === 'undefined') {
      console.error('ApexCharts no está cargado');
      return;
    }

    if (!this.chartDiv?.nativeElement) {
      console.error('Elemento del gráfico no encontrado');
      return;
    }

    const topLinks = linksData.topLinks
      .sort((a, b) => b.clicksCount - a.clicksCount)
      .slice(0, 8);

    const labels = topLinks.map(link => {
      let label = link.customAlias || link.title || link.shortCode;
      return label.length > 20 ? label.substring(0, 20) + '...' : label;
    });

    const values = topLinks.map(link => link.clicksCount);

    const options = {
      series: [{
        name: 'Clics',
        data: values
      }],
      chart: {
        type: 'bar',
        height: 450,
        background: 'transparent',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '60%'
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000'],
          fontSize: '12px'
        }
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: '#000',
            fontSize: '12px'
          }
        },
        title: {
          text: 'Número de Clics',
          style: {
            color: '#000'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000',
            fontSize: '11px'
          }
        }
      },
      colors: ['#00E396'],
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + ' clicks';
          }
        }
      },
      grid: {
        borderColor: '#444'
      }
    };

    try {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new ApexCharts(this.chartDiv.nativeElement, options);
      this.chart.render();
    } catch (error) {
      console.error('Error creando el gráfico:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  filterDate(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case '1h':
        this.filterPeriodSelected.set('1h');
        break;
      case '7d':
        this.filterPeriodSelected.set('7d');
        break;
      case '30d':
        this.filterPeriodSelected.set('30d');
        break;
      case '90d':
        this.filterPeriodSelected.set('90d');
        break;
      case '1y':
        this.filterPeriodSelected.set('1y');
        break;
      default:
        this.filterPeriodSelected.set('30d');
        break;
    }

    this.loadData(this.filterPeriodSelected());

    console.log('Valor actual de la senal:', this.filterPeriodSelected());
  }
}

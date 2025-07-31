// import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
// import { AnalyticsService } from '../../services/analytics.service';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../auth/services/auth.service';
// import { GetUserDataByIDInterface } from '../../interfaces/get-user-data-by-id.interface';
// import { HttpErrorResponse } from '@angular/common/http';
// import { ChartHelpers } from '../../../../shared/utils/helpers/chart.analytics-personals';
// import { ErrorRequestsComponent } from "../../../../shared/components/errors/error-requests/error-requests.component";
// import { LoadingComponentComponent } from "../../../../shared/components/loading/loading-component/loading-component.component";

// declare var ApexCharts: any;

// @Component({
//   selector: 'app-analytics-component',
//   imports: [CommonModule, ErrorRequestsComponent, LoadingComponentComponent],
//   templateUrl: './analytics-component.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export default class AnalyticsComponentComponent implements AfterViewInit, OnDestroy {
//   @ViewChild('analytics', { static: false }) chartOne!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics2', { static: false }) chartTwo!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics3', { static: false }) chartThree!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics4', { static: false }) chartFour!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics5', { static: false }) chartFive!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics6', { static: false }) chartSix!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics7', { static: false }) chartSeven!: ElementRef<HTMLDivElement>;
//   @ViewChild('analytics8', { static: false }) chartEight!: ElementRef<HTMLDivElement>;

//   analyticsService = inject(AnalyticsService);
//   authService = inject(AuthService);
//   chartHelpers = ChartHelpers;

//   chart: any = null;
//   chart2: any = null;
//   chart3: any = null;
//   chart4: any = null;
//   chart5: any = null;
//   chart6: any = null;
//   chart7: any = null;
//   chart8: any = null;

//   userData = signal<GetUserDataByIDInterface | null>(null);
//   loading = signal<boolean>(true);
//   errors = signal<{ message: string, code: number }>({ message: '', code: 0 });

//   ngAfterViewInit(): void {
//     this.loading.set(true);
//     this.errors.set({ message: '', code: 0 });

//     this.analyticsService.getUserDataByIdAnalytics(this.authService.getUserId()!).subscribe({
//       next: (res: GetUserDataByIDInterface) => {
//         this.userData.set(res);
//         this.loading.set(false);
//         this.errors.set({ message: '', code: 0 });

//         const distributionForCreationLinksAndClicks = [res.stats.quantityClicks, res.stats.quantityLinks];
//         const distributionForCreationLinkCategories = ['Total de clicks', 'Total de enlaces'];
//         this.createChart(distributionForCreationLinksAndClicks, distributionForCreationLinkCategories);

//         const topLinksData = this.chartHelpers.getTopLinksByClicks(res);
//         const topLinksDataLabels = res.data.links.map(link => link.title);
//         this.createChart2(topLinksData.values, topLinksDataLabels);

//         const countryData = this.chartHelpers.getClicksByCountry(res);
//         this.createChart3(countryData.values, countryData.labels);

//         const deviceData = this.chartHelpers.getClicksByDevice(res);
//         this.createChart4(deviceData.values, deviceData.labels);

//         const clicksOverTimeData = this.chartHelpers.getClicksOverTime(res);
//         this.createChart5(clicksOverTimeData.dates, clicksOverTimeData.counts);

//         const categoryClicksData = this.chartHelpers.getClicksByCategory(res);
//         this.createChart6(categoryClicksData.values, categoryClicksData.labels);

//         const browserClicksData = this.chartHelpers.getClicksByBrowser(res);
//         this.createChart7(browserClicksData.values, browserClicksData.labels);

//         const linkStatusData = this.chartHelpers.getLinkStatusCounts(res);
//         this.createChart8(linkStatusData.values, linkStatusData.labels);
//       },
//       error: (err: HttpErrorResponse) => {
//         this.loading.set(false);
//         this.errors.set({ message: err.error.message, code: err.status });
//       },
//       complete: () => {
//         this.loading.set(false);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.chart) {
//       this.chart.destroy();
//       this.chart = null;
//     }
//     if (this.chart2) {
//       this.chart2.destroy();
//       this.chart2 = null;
//     }
//     if (this.chart3) {
//       this.chart3.destroy();
//       this.chart3 = null;
//     }
//     if (this.chart4) {
//       this.chart4.destroy();
//       this.chart4 = null;
//     }
//     if (this.chart5) {
//       this.chart5.destroy();
//       this.chart5 = null;
//     }
//     if (this.chart6) {
//       this.chart6.destroy();
//       this.chart6 = null;
//     }
//     if (this.chart7) {
//       this.chart7.destroy();
//       this.chart7 = null;
//     }
//     if (this.chart8) {
//       this.chart8.destroy();
//       this.chart8 = null;
//     }
//   }

//   private createChart(data: number[], categories: string[]): void {
//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const chartContainer = this.chartOne.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Distribución de enlaces y clicks",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const total = data.reduce((sum, value) => sum + value, 0);

//     const donutOptions = {
//       series: data,
//       chart: {
//         type: 'donut',
//         height: 380,
//         background: '#ffffff',
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       labels: categories,
//       colors: ['#3E66FB', '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A936F'],
//       plotOptions: {
//         pie: {
//           donut: {
//             size: '70%',
//             labels: {
//               show: true,
//               name: {
//                 show: true,
//                 fontSize: '16px',
//                 fontWeight: 600
//               },
//               value: {
//                 show: true,
//                 fontSize: '20px',
//                 fontWeight: 700,
//                 color: '#333'
//               },
//               total: {
//                 show: true,
//                 label: 'Total',
//                 fontSize: '18px',
//                 fontWeight: 700,
//                 color: '#444',
//                 formatter: () => total.toString()
//               }
//             }
//           }
//         }
//       },
//       legend: {
//         position: 'bottom',
//         fontSize: '14px',
//         fontWeight: 500,
//         markers: {
//           width: 12,
//           height: 12
//         },
//         itemMargin: {
//           horizontal: 10,
//           vertical: 5
//         }
//       },
//       tooltip: {
//         y: {
//           formatter: (val: number) => `${val} ${val === data[0] ? 'clics' : 'enlaces'}`
//         }
//       },
//       title: {
//         text: 'Distribución de enlaces y clicks',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ['#fff']
//       },
//       states: {
//         hover: {
//           filter: {
//             type: 'lighten',
//             value: 0.15
//           }
//         }
//       },
//       responsive: [{
//         breakpoint: 480,
//         options: {
//           chart: {
//             height: 320
//           },
//           legend: {
//             position: 'bottom'
//           }
//         }
//       }]
//     };

//     this.chart = new ApexCharts(this.chartOne.nativeElement, donutOptions);
//     this.chart.render();
//   }

//   private createChart2(data: number[], categories: string[]): void {
//     if (this.chart2) {
//       this.chart2.destroy();
//     }

//     const chartContainer = this.chartTwo.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Top Enlaces",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const options = {
//       series: [{
//         name: "Clics",
//         data: data
//       }],
//       chart: {
//         type: 'bar',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 6,
//           borderRadiusApplication: 'end',
//           horizontal: true,
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       xaxis: {
//         categories: categories,
//         title: {
//           text: 'Número de Clics',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Enlaces',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       colors: ['#4361ee'],
//       title: {
//         text: 'Top 10 Enlaces por Clicks',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       tooltip: {
//         theme: 'dark',
//         y: {
//           formatter: function (val: number) {
//             return val + " clics";
//           }
//         }
//       },
//       grid: {
//         xaxis: {
//           lines: {
//             show: true
//           }
//         },
//         yaxis: {
//           lines: {
//             show: false
//           }
//         }
//       }
//     };

//     this.chart2 = new ApexCharts(this.chartTwo.nativeElement, options);
//     this.chart2.render();
//   }

//   private createChart3(data: number[], categories: string[]): void {
//     if (this.chart3) {
//       this.chart3.destroy();
//     }

//     const chartContainer = this.chartThree.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Distribución de clicks por País",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const options = {
//       series: [{
//         name: "Clics",
//         data: data
//       }],
//       chart: {
//         type: 'bar',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 6,
//           borderRadiusApplication: 'end',
//           horizontal: true,
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       xaxis: {
//         categories: categories,
//         title: {
//           text: 'Número de Clics',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Países',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       colors: ['#4cc9f0'],
//       title: {
//         text: 'Distribución de Clics por País',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       tooltip: {
//         theme: 'dark',
//         y: {
//           formatter: function (val: number) {
//             return val + " clics";
//           }
//         }
//       },
//       grid: {
//         xaxis: {
//           lines: {
//             show: true
//           }
//         },
//         yaxis: {
//           lines: {
//             show: false
//           }
//         }
//       }
//     };

//     this.chart3 = new ApexCharts(this.chartThree.nativeElement, options);
//     this.chart3.render();
//   }

//   private createChart4(data: number[], categories: string[]): void {
//     if (this.chart4) {
//       this.chart4.destroy();
//     }

//     const chartContainer = this.chartFour.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Distribución de clicks por Dispositivo",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const options = {
//       series: [{
//         name: "Clics",
//         data: data
//       }],
//       chart: {
//         type: 'bar',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 6,
//           borderRadiusApplication: 'end',
//           horizontal: true,
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       xaxis: {
//         categories: categories,
//         title: {
//           text: 'Número de Clics',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Dispositivos',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       colors: ['#7209b7'],
//       title: {
//         text: 'Distribución de Clics por Dispositivo',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       tooltip: {
//         theme: 'dark',
//         y: {
//           formatter: function (val: number) {
//             return val + " clics";
//           }
//         }
//       },
//       grid: {
//         xaxis: {
//           lines: {
//             show: true
//           }
//         },
//         yaxis: {
//           lines: {
//             show: false
//           }
//         }
//       }
//     };

//     this.chart4 = new ApexCharts(this.chartFour.nativeElement, options);
//     this.chart4.render();
//   }

//   private createChart5(categories: string[], data: number[]): void {
//     if (this.chart5) {
//       this.chart5.destroy();
//     }

//     const chartContainer = this.chartFive.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Crecimiento de clicks en el Tiempo",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const options = {
//       series: [{
//         name: "Clics",
//         data: data
//       }],
//       chart: {
//         type: 'line',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         curve: 'smooth',
//         width: 3
//       },
//       xaxis: {
//         categories: categories,
//         title: {
//           text: 'Fecha',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Número de Clicks',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       colors: ['#f72585'],
//       title: {
//         text: 'Crecimiento de Clics en el Tiempo',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       tooltip: {
//         theme: 'dark',
//         y: {
//           formatter: function (val: number) {
//             return val + " clics";
//           }
//         }
//       },
//       grid: {
//         borderColor: '#e7e7e7',
//         row: {
//           colors: ['#f3f3f3', 'transparent'],
//           opacity: 0.5
//         },
//       }
//     };

//     this.chart5 = new ApexCharts(this.chartFive.nativeElement, options);
//     this.chart5.render();
//   }

//   private createChart6(data: number[], categories: string[]): void {
//     if (this.chart6) {
//       this.chart6.destroy();
//     }

//     const chartContainer = this.chartSix.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Clicks por Categoría de Enlace",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const options = {
//       series: [{
//         name: "Clics",
//         data: data
//       }],
//       chart: {
//         type: 'bar',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 4,
//           borderRadiusApplication: 'end',
//           horizontal: false,
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       xaxis: {
//         categories: categories,
//         title: {
//           text: 'Categorías',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Número de Clics',
//           style: {
//             fontSize: '14px',
//             fontWeight: 500
//           }
//         }
//       },
//       colors: ['#4CAF50'],
//       title: {
//         text: 'Clicks por Categoría de Enlace',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       tooltip: {
//         theme: 'dark',
//         y: {
//           formatter: function (val: number) {
//             return val + " clics";
//           }
//         }
//       },
//       grid: {
//         xaxis: {
//           lines: {
//             show: false
//           }
//         },
//         yaxis: {
//           lines: {
//             show: true
//           }
//         }
//       }
//     };

//     this.chart6 = new ApexCharts(this.chartSix.nativeElement, options);
//     this.chart6.render();
//   }

//   private createChart7(data: number[], categories: string[]): void {
//     if (this.chart7) {
//       this.chart7.destroy();
//     }

//     const chartContainer = this.chartSeven.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Distribución de clicks por Categoría",
//         "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const total = data.reduce((sum, value) => sum + value, 0);

//     const options = {
//       series: data,
//       chart: {
//         type: 'pie',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       labels: categories,
//       colors: ['#FF9F1C', '#2EC4B6', '#E71D36', '#662E9B', '#43BCCD'],
//       legend: {
//         position: 'bottom',
//         fontSize: '14px',
//         fontWeight: 500,
//         markers: {
//           width: 12,
//           height: 12
//         },
//         itemMargin: {
//           horizontal: 10,
//           vertical: 5
//         }
//       },
//       tooltip: {
//         y: {
//           formatter: (val: number) => `${val} clics`
//         }
//       },
//       title: {
//         text: 'Distribución de Clics por Navegador',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       dataLabels: {
//         enabled: true,
//         formatter: function (val: number) {
//           return val.toFixed(1) + "%";
//         },
//         style: {
//           fontSize: '12px',
//         }
//       },
//       responsive: [{
//         breakpoint: 480,
//         options: {
//           chart: {
//             height: 300
//           },
//           legend: {
//             position: 'bottom'
//           }
//         }
//       }]
//     };

//     this.chart7 = new ApexCharts(this.chartSeven.nativeElement, options);
//     this.chart7.render();
//   }

//   private createChart8(data: number[], categories: string[]): void {
//     if (this.chart8) {
//       this.chart8.destroy();
//     }

//     const chartContainer = this.chartEight.nativeElement;
//     chartContainer.innerHTML = '';

//     if (!data || data.length === 0 || data.every(v => v === 0)) {
//       chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
//         "Estado de los enlaces",
//         "Aún no hay enlaces registrados. ¡Cada enlace cuenta para empezar a ver tus estadísticas!",
//         "Compartir mis enlaces"
//       );
//       return;
//     }

//     const total = data.reduce((sum, value) => sum + value, 0);

//     const options = {
//       series: data,
//       chart: {
//         type: 'donut',
//         height: 350,
//         animations: {
//           enabled: true,
//           easing: 'easeinout',
//           speed: 800
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       labels: categories,
//       colors: ['#06D6A0', '#EF476F'],
//       plotOptions: {
//         pie: {
//           donut: {
//             size: '65%',
//             labels: {
//               show: true,
//               name: {
//                 show: true,
//                 fontSize: '14px',
//                 fontWeight: 600
//               },
//               value: {
//                 show: true,
//                 fontSize: '16px',
//                 fontWeight: 700,
//                 color: '#333'
//               },
//               total: {
//                 show: true,
//                 label: 'Total Enlaces',
//                 fontSize: '16px',
//                 fontWeight: 700,
//                 color: '#444',
//                 formatter: () => total.toString()
//               }
//             }
//           }
//         }
//       },
//       legend: {
//         position: 'bottom',
//         fontSize: '14px',
//         fontWeight: 500,
//         markers: {
//           width: 12,
//           height: 12
//         },
//         itemMargin: {
//           horizontal: 10,
//           vertical: 5
//         }
//       },
//       tooltip: {
//         y: {
//           formatter: (val: number) => `${val} enlaces`
//         }
//       },
//       title: {
//         text: 'Estado de los Enlaces',
//         align: 'center',
//         style: {
//           fontSize: '18px',
//           fontWeight: 600,
//           color: '#2B3A67'
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ['#fff']
//       },
//       states: {
//         hover: {
//           filter: {
//             type: 'lighten',
//             value: 0.15
//           }
//         }
//       },
//       responsive: [{
//         breakpoint: 480,
//         options: {
//           chart: {
//             height: 300
//           },
//           legend: {
//             position: 'bottom'
//           }
//         }
//       }]
//     };

//     this.chart8 = new ApexCharts(this.chartEight.nativeElement, options);
//     this.chart8.render();


//   }
// }

import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { GetUserDataByIDInterface } from '../../interfaces/get-user-data-by-id.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartHelpers } from '../../../../shared/utils/helpers/chart.analytics-personals';
import { ErrorRequestsComponent } from "../../../../shared/components/errors/error-requests/error-requests.component";
import { LoadingComponentComponent } from "../../../../shared/components/loading/loading-component/loading-component.component";

declare var ApexCharts: any;

@Component({
  selector: 'app-analytics-component',
  imports: [CommonModule, ErrorRequestsComponent, LoadingComponentComponent],
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
  private cdr = inject(ChangeDetectorRef);
  chartHelpers = ChartHelpers;

  private chartsInitialized = false;
  private dataLoaded = false;
  private retryCount = 0;
  private maxRetries = 10;

  chart: any = null;
  chart2: any = null;
  chart3: any = null;
  chart4: any = null;
  chart5: any = null;
  chart6: any = null;
  chart7: any = null;
  chart8: any = null;

  userData = signal<GetUserDataByIDInterface | null>(null);
  loading = signal<boolean>(true);
  errors = signal<{ message: string, code: number }>({ message: '', code: 0 });

  ngAfterViewInit(): void {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    if (this.dataLoaded) return;

    this.loading.set(true);
    this.errors.set({ message: '', code: 0 });

    this.analyticsService.getUserDataByIdAnalytics(this.authService.getUserId()!).subscribe({
      next: (res: GetUserDataByIDInterface) => {
        this.userData.set(res);
        this.dataLoaded = true;
        this.loading.set(false);
        this.errors.set({ message: '', code: 0 });

        this.cdr.detectChanges();

        setTimeout(() => {
          this.renderAllCharts(res);
        }, 200);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errors.set({ message: err.error.message, code: err.status });
        this.cdr.detectChanges();
      }
    });
  }

  private renderAllCharts(data: GetUserDataByIDInterface): void {
    if (this.chartsInitialized) return;

    if (this.retryCount === 0) {
      console.log('🎯 Iniciando renderizado de gráficos...');
    }

    if (!this.areViewChildsReady()) {
      this.retryCount++;

      if (this.retryCount >= this.maxRetries) {
        this.retryCount = 0;
        return;
      }

      setTimeout(() => this.renderAllCharts(data), 300);
      return;
    }

    console.log('✅ ViewChild elements ready, rendering charts...');
    this.retryCount = 0;
    this.chartsInitialized = true;

    try {
      this.renderChartsSequentially(data);
    } catch (error) {
      console.error(error);
      this.chartsInitialized = false;
    }
  }

  private renderChartsSequentially(data: GetUserDataByIDInterface): void {
    const renderSteps = [
      () => {
        const distributionData = [data.stats.quantityClicks, data.stats.quantityLinks];
        const distributionLabels = ['Total de clicks', 'Total de enlaces'];
        this.createChart(distributionData, distributionLabels);
      },
      () => {
        const topLinksData = this.chartHelpers.getTopLinksByClicks(data);
        const topLinksLabels = data.data.links.map(link => link.title);
        this.createChart2(topLinksData.values, topLinksLabels);
      },
      () => {
        const countryData = this.chartHelpers.getClicksByCountry(data);
        this.createChart3(countryData.values, countryData.labels);
      },
      () => {
        const deviceData = this.chartHelpers.getClicksByDevice(data);
        this.createChart4(deviceData.values, deviceData.labels);
      },
      () => {
        const clicksOverTimeData = this.chartHelpers.getClicksOverTime(data);
        this.createChart5(clicksOverTimeData.dates, clicksOverTimeData.counts);
      },
      () => {
        const categoryClicksData = this.chartHelpers.getClicksByCategory(data);
        this.createChart6(categoryClicksData.values, categoryClicksData.labels);
      },
      () => {
        const browserClicksData = this.chartHelpers.getClicksByBrowser(data);
        this.createChart7(browserClicksData.values, browserClicksData.labels);
      },
      () => {
        const linkStatusData = this.chartHelpers.getLinkStatusCounts(data);
        this.createChart8(linkStatusData.values, linkStatusData.labels);
      }
    ];

    renderSteps.forEach((renderStep, index) => {
      setTimeout(renderStep, index * 50);
    });
  }

  private areViewChildsReady(): boolean {
    const elements = [
      this.chartOne?.nativeElement,
      this.chartTwo?.nativeElement,
      this.chartThree?.nativeElement,
      this.chartFour?.nativeElement,
      this.chartFive?.nativeElement,
      this.chartSix?.nativeElement,
      this.chartSeven?.nativeElement,
      this.chartEight?.nativeElement
    ];

    const readyElements = elements.filter(el => el && el.offsetParent !== null);
    const allReady = readyElements.length === elements.length;

    console.log(`📊 ViewChild status: ${readyElements.length}/${elements.length} ready`);

    return allReady;
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  private destroyAllCharts(): void {
    const charts = [this.chart, this.chart2, this.chart3, this.chart4,
    this.chart5, this.chart6, this.chart7, this.chart8];

    charts.forEach((chart, index) => {
      if (chart) {
        try {
          chart.destroy();
        } catch (error) {
          console.warn(`Error destroying chart ${index + 1}:`, error);
        }
      }
    });

    this.chart = null;
    this.chart2 = null;
    this.chart3 = null;
    this.chart4 = null;
    this.chart5 = null;
    this.chart6 = null;
    this.chart7 = null;
    this.chart8 = null;
  }

  private createChart(data: number[], categories: string[]): void {
    if (!this.chartOne?.nativeElement) {
      console.warn('Chart 1 container not available');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
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

    try {
      this.chart = new ApexCharts(this.chartOne.nativeElement, donutOptions);
      this.chart.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart2(data: number[], categories: string[]): void {
    if (!this.chartTwo?.nativeElement) {
      console.warn('Chart 2 container not available');
      return;
    }

    if (this.chart2) {
      this.chart2.destroy();
      this.chart2 = null;
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

    try {
      this.chart2 = new ApexCharts(this.chartTwo.nativeElement, options);
      this.chart2.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart3(data: number[], categories: string[]): void {
    if (!this.chartThree?.nativeElement) {
      console.warn('Chart 3 container not available');
      return;
    }

    if (this.chart3) {
      this.chart3.destroy();
      this.chart3 = null;
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

    try {
      this.chart3 = new ApexCharts(this.chartThree.nativeElement, options);
      this.chart3.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart4(data: number[], categories: string[]): void {
    if (!this.chartFour?.nativeElement) {
      console.warn('Chart 4 container not available');
      return;
    }

    if (this.chart4) {
      this.chart4.destroy();
      this.chart4 = null;
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

    try {
      this.chart4 = new ApexCharts(this.chartFour.nativeElement, options);
      this.chart4.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart5(categories: string[], data: number[]): void {
    if (!this.chartFive?.nativeElement) {
      console.warn('Chart 5 container not available');
      return;
    }

    if (this.chart5) {
      this.chart5.destroy();
      this.chart5 = null;
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

    try {
      this.chart5 = new ApexCharts(this.chartFive.nativeElement, options);
      this.chart5.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart6(data: number[], categories: string[]): void {
    if (!this.chartSix?.nativeElement) {
      console.warn('Chart 6 container not available');
      return;
    }

    if (this.chart6) {
      this.chart6.destroy();
      this.chart6 = null;
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

    try {
      this.chart6 = new ApexCharts(this.chartSix.nativeElement, options);
      this.chart6.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart7(data: number[], categories: string[]): void {
    if (!this.chartSeven?.nativeElement) {
      console.warn('Chart 7 container not available');
      return;
    }

    if (this.chart7) {
      this.chart7.destroy();
      this.chart7 = null;
    }

    const chartContainer = this.chartSeven.nativeElement;
    chartContainer.innerHTML = '';

    if (!data || data.length === 0 || data.every(v => v === 0)) {
      chartContainer.innerHTML = this.chartHelpers.getNoDataMessageHTML(
        "Distribución de clicks por Navegador",
        "Aún no hay clicks registrados. ¡Cada click cuenta para empezar a ver tus estadísticas!",
        "Compartir mis enlaces"
      );
      return;
    }

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

    try {
      this.chart7 = new ApexCharts(this.chartSeven.nativeElement, options);
      this.chart7.render();
    } catch (error) {
      console.error(error);
    }
  }

  private createChart8(data: number[], categories: string[]): void {
    if (!this.chartEight?.nativeElement) {
      console.warn('Chart 8 container not available');
      return;
    }

    if (this.chart8) {
      this.chart8.destroy();
      this.chart8 = null;
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

    try {
      this.chart8 = new ApexCharts(this.chartEight.nativeElement, options);
      this.chart8.render();
    } catch (error) {
      console.error('❌ Error creating chart 8:', error);
    }
  }
}

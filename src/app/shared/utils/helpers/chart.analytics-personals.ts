import { GetUserDataByIDInterface } from "../../../features/analytics/interfaces/get-user-data-by-id.interface";

export class ChartHelpers {

  static getNoDataMessageHTML(title: string, message: string, actionText: string): string {
    return `
      <div class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-center">

        <!-- Icono de estado -->
        <div class="mb-4 rounded-full bg-gray-100 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <!-- Contenido de texto -->
        <div class="space-y-2 px-4">
          <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
          <p class="text-sm text-gray-600">${message}</p>
        </div>

        <!-- Texto de acción (estilizado como un botón sutil) -->
        <div class="mt-6">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            ${actionText}
          </span>
        </div>

        <!-- Elemento decorativo opcional (línea sutil debajo) -->
        <!-- <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div> -->
      </div>
    `;
  }

  static getTopLinksByClicks(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    const clickCountMap = new Map<string, number>();
    data.data.clicks.forEach(click => {
      const currentCount = clickCountMap.get(click.linkId) || 0;
      clickCountMap.set(click.linkId, currentCount + 1);
    });

    const sortedLinks = Array.from(clickCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const labels: string[] = [];
    const values: number[] = [];

    sortedLinks.forEach(([linkId, count]) => {
      const link = data.data.links.find(l => l.id === linkId);
      const label = link?.title || link?.shortCode || link?.customAlias || linkId;
      const truncatedLabel = label.length > 25 ? label.substring(0, 22) + '...' : label;
      labels.push(truncatedLabel);
      values.push(count);
    });

    return { labels, values };
  }

  static getClicksByCountry(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    const countryCountMap = new Map<string, number>();

    data.data.clicks.forEach(click => {
      if (click.country) {
        const currentCount = countryCountMap.get(click.country) || 0;
        countryCountMap.set(click.country, currentCount + 1);
      }
    });

    const sortedCountries = Array.from(countryCountMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const labels = sortedCountries.map(([country]) => country);
    const values = sortedCountries.map(([, count]) => count);

    return { labels, values };
  }

  static getClicksByDevice(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    const deviceCountMap = new Map<string, number>();

    data.data.clicks.forEach(click => {
      const device = click.device || 'Desconocido';
      const currentCount = deviceCountMap.get(device) || 0;
      deviceCountMap.set(device, currentCount + 1);
    });

    const labels = Array.from(deviceCountMap.keys());
    const values = Array.from(deviceCountMap.values());

    return { labels, values };
  }

  static getClicksOverTime(data: GetUserDataByIDInterface): { dates: string[], counts: number[] } {
    const dateCountMap = new Map<string, number>();

    data.data.clicks.forEach(click => {
      const date = new Date(click.created_at).toISOString().split('T')[0];
      const currentCount = dateCountMap.get(date) || 0;
      dateCountMap.set(date, currentCount + 1);
    });

    const sortedDates = Array.from(dateCountMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));

    const dates = sortedDates.map(([date]) => date);
    const counts = sortedDates.map(([, count]) => count);

    return { dates, counts };
  }

  static getClicksByCategory(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    const categoryClickMap = new Map<string, number>();

    data.data.clicks.forEach(click => {
      const link = data.data.links.find(l => l.id === click.linkId);
      if (link) {
        const category = link.category || 'Sin Categoría';
        const currentCount = categoryClickMap.get(category) || 0;
        categoryClickMap.set(category, currentCount + 1);
      }
    });

    const sortedCategories = Array.from(categoryClickMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const labels = sortedCategories.map(([category]) => category);
    const values = sortedCategories.map(([, count]) => count);

    return { labels, values };
  }

  static getClicksByBrowser(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    const browserCountMap = new Map<string, number>();

    data.data.clicks.forEach(click => {
      const browser = click.browser || 'Desconocido';
      const currentCount = browserCountMap.get(browser) || 0;
      browserCountMap.set(browser, currentCount + 1);
    });

    const labels = Array.from(browserCountMap.keys());
    const values = Array.from(browserCountMap.values());

    return { labels, values };
  }

  static getLinkStatusCounts(data: GetUserDataByIDInterface): { labels: string[], values: number[] } {
    let activeCount = 0;
    let inactiveCount = 0;

    data.data.links.forEach(link => {
      if (link.isActive) {
        activeCount++;
      } else {
        inactiveCount++;
      }
    });

    return {
      labels: ['Activos', 'Inactivos'],
      values: [activeCount, inactiveCount]
    };
  }
}

export interface GetAnalyticsConversionRateInterface {
  metrics: Metrics;
}

interface Metrics {
  totalLinks: number;
  totalClicks: number;
  conversionRate: string;
  clickRatio: string;
  timestamp: Date;
}

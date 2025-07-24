export interface GetAnalyticsTimeSeriesInterface {
  metrics: Metrics;
}

export interface Metrics {
  totalLinks: number;
  totalClicks: number;
  conversionRate: string;
  clickRatio: string;
  timestamp: Date;
}

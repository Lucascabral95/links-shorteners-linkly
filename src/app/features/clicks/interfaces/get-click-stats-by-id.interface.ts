export interface GetClickStatsByIDInterface {
  click: Click;
  totalClicks: number;
  metrics: Metrics;
  clicks: Click[];
}

interface Click {
  id: string;
  linkId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  country: null;
  city: null;
  device: string;
  browser: string;
  created_at: Date;
  updated_at: Date;
  link?: Link;
  user?: User;
}

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  title: string;
  description: string;
  expiresAt: Date;
  customAlias: string;
  isActive: boolean;
  isPublic: boolean;
  category: string;
  created_at: Date;
  updated_at: Date;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface Metrics {
  byCountry: ByCountry[];
  byDevice: ByDevice[];
  byCity: ByCity[];
  byBrowser: ByBrowser[];
  timeSeries: TimeSery[];
}

interface ByBrowser {
  browser: string;
  count: number;
}

interface ByCountry {
  country: null;
  count: number;
}

interface ByDevice {
  device: string;
  count: number;
}

interface ByCity {
  city: string;
  count: number;
}

interface TimeSery {
  date: Date;
  count: number;
}

export interface GetAnalyticsGeographicInterface {
  geographic: BrowserElement[];
  countries: BrowserElement[];
  cities: BrowserElement[];
  devices: BrowserElement[];
  browsers: BrowserElement[];
  stats: Stats;
  rankings: Rankings;
  metadata: Metadata;
}

interface BrowserElement {
  country: null | string;
  city: null | string;
  device: string;
  browser: string;
  _count: Count;
}

interface Count {
  country: number;
  city: number;
  device: number;
  browser: number;
}

interface Metadata {
  queryLimit: number;
  timestamp: Date;
  dataIntegrity: DataIntegrity;
}

interface DataIntegrity {
  countriesWithoutCities: number;
  citiesWithoutCountry: number;
  hasIncompleteData: boolean;
}

interface Rankings {
  topCountries: TopCity[];
  topCities: TopCity[];
  topDevices: TopCity[];
  topBrowsers: TopBrowser[];
}

interface TopBrowser {
  rank?: number;
  browser: string;
  clicks: number;
  percentage: string;
}

interface TopCity {
  rank?: number;
  city?: string;
  country?: string;
  clicks: number;
  percentage: string;
  device?: string;
}

interface Stats {
  uniqueCountries: number;
  uniqueCities: number;
  uniqueDevices: number;
  uniqueBrowsers: number;
  countryClicks: number;
  cityClicks: number;
  deviceClicks: number;
  browserClicks: number;
  totalClicks: number;
  topCountry: string;
  topCity: string;
  topDevice: string;
  topBrowser: string;
  countryDistribution: TopCity[];
  deviceDistribution: TopCity[];
  browserDistribution: TopBrowser[];
}

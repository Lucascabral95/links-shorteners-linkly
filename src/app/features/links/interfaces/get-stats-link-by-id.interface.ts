export interface GetStatsLinkByIDInterface {
  link: Link;
  totalClicks: number;
  countries: Country[];
  cities: City[];
  devices: Device[];
  browsers: Browser[];
}

interface Browser {
  _count: BrowserCount;
  browser: string;
}

interface BrowserCount {
  browser: number;
}

interface City {
  _count: CityCount;
  city: null | string;
}

interface CityCount {
  city: number;
}

interface Country {
  _count: CountryCount;
  country: null | string;
}

interface CountryCount {
  country: number;
}

interface Device {
  _count: DeviceCount;
  device: string;
}

interface DeviceCount {
  device: number;
}

interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  title: string;
  description: string;
  password: string;
  expiresAt: null;
  isActive: boolean;
  isPublic: boolean;
  category: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
  user: User;
}

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: null;
  picture: null;
  provider: string;
}

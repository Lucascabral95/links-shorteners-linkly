export interface GetUserDataByIDInterface {
  stats: Stats;
  data: Data;
}

interface Data {
  links: Link[];
  clicks: Click[];
}

interface Click {
  id: string;
  linkId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  created_at: Date;
  updated_at: Date;
}

interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  title: string;
  description?: string;
  expiresAt?: Date | null;
  isActive: boolean;
  isPublic: boolean;
  category?: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

interface Stats {
  quantityLinks: number;
  quantityClicks: number;
}

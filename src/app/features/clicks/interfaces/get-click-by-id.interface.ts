export interface GetClickByIDInterface {
  id: string;
  linkId: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: null;
  city?: null;
  device?: string;
  browser?: string;
  created_at: Date;
  updated_at: Date;
  link: Link;
  user: User;
}

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  description?: string;
  expiresAt?: Date | null;
  isActive: boolean;
  isPublic: boolean;
  category?: string;
  created_at: Date;
  updated_at: Date;
  userId: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

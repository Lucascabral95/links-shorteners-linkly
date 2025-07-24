import { Role } from "../../auth/interfaces";

export interface GetLinksInterface {
  quantityLinks: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  links: Link[];
}

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  description?: string;
  password?: string;
  expiresAt?: Date | null;
  isActive: boolean;
  isPublic: boolean;
  category?: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
  clicks: Click[];
  user: User;
}

export interface Click {
  id: string;
  linkId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  country?: string | null;
  city?: string | null;
  device: string;
  browser: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId?: string | null;
  picture?: string | null;
  provider: string;
}

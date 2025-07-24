import { Role } from "../../auth/interfaces";

export interface GetUsersInterface {
  quantityUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  users: User[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: Role;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId?: string;
  picture?: string;
  provider: string;
  clicks: Click[];
  links: Link[];
}

export interface Click {
  id: string;
  linkId: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device: string;
  browser: string;
  created_at: Date;
  updated_at: Date;
}

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
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
}

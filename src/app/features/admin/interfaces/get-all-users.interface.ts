import { Role } from "../../auth/interfaces";

export interface GetAllUsersInterface {
  quantityUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  users: User[];
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: null | string;
  picture: null | string;
  provider: string;
  links: Link[];
  clicks: Click[];
}

export interface Click {
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
}


interface Link {
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
  userId?: string;
  created_at: Date;
  updated_at: Date;
}

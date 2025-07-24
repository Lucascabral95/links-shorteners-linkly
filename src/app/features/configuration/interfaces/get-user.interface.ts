export interface GetUsersInterface {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: string;
  picture: string;
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
  title: string;
  description: string;
  password?: string;
  expiresAt?: null | Date;
  isActive: boolean;
  isPublic: boolean;
  category: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

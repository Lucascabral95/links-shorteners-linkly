export interface ResponseCreateLinkInterface {
  linkCreated: LinkCreated;
  message: string;
}

export interface LinkCreated {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  title: string;
  description: string;
  password: string;
  expiresAt: null | Date;
  isActive: boolean;
  isPublic: boolean;
  category: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

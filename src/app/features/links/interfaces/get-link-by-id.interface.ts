export interface GetLinkByIDInterface {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  description?: string;
  password?: string;
  expiresAt?: Date | null;
  isActive?: boolean;
  isPublic?: boolean;
  category?: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

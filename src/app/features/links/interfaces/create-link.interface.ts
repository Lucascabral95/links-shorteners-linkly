export interface CreateLinkInterface {
  userId: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  description?: string;
  password?: string;
  expiresAt?: Date;
  isActive?: boolean;
  isPublic?: boolean;
  category?: string;
}

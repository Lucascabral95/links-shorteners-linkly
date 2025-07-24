export interface UpdateLinkInterface {
  userId?: string;
  originalUrl?: string;
  shortCode?: string;
  customAlias?: string;
  title?: string;
  description?: string;
  password?: string;
  expiresAt?: Date | string | null;
  isActive?: boolean;
  isPublic?: boolean;
  category?: string;
}

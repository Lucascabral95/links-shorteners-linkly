export interface GetLinksTopInterface {
  quantityLinks: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  topLinks: TopLink[];
}

export interface TopLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  title: string;
  description: string;
  isActive: boolean;
  isPublic: boolean;
  category: string;
  created_at: Date;
  updated_at: Date;
  userId: string;
  clicksCount: number;
}

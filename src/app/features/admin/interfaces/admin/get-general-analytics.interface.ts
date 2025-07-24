export interface GetGeneralAnalyticsInterface {
  totalLinks: number;
  totalClicks: number;
  totalUsers: number;
  totalPremiumUsers: number;
  totalFreeUsers: number;
  totalGuestUsers: number;
  totalAdminUsers: number;
  distributionUsers: DistributionUser[];
}

export interface DistributionUser {
  _count: Count;
  role: string;
}

export interface Count {
  role: number;
}

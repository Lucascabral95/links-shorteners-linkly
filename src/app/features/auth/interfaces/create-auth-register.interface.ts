export enum Role {
  ADMIN = "ADMIN",
  PREMIUM = "PREMIUM",
  FREE = "FREE",
  GUEST = "GUEST"
}

export interface CreateAuthRegisterInterface {
  email: string;
  password: string;
  full_name: string;
  role?: Role;
  verified?: boolean;
  googleId?: string;
  picture?: string;
}

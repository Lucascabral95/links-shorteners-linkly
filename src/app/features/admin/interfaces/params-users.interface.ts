import { Role } from "../../auth/interfaces";

export interface ParamsUsersInterface {
  page?: number;
  limit?: number;
  full_name?: string;
  role?: Role;
  verified?: boolean;
  provider?: string;
}

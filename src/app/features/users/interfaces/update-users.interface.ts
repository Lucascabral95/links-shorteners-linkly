import { Role } from "../../auth/interfaces";

export interface UpdateUsersInterface {
  full_name?: string;
  role?: Role;
  verified?: boolean;
}

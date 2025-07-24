import { Role } from "../../auth/interfaces";

export interface ResponseUpdateUsersInterface {
  data: Data;
  message: string;
}

export interface Data {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  links: any[];
  clicks: any[];
}

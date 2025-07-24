import { Role } from "../../auth/interfaces";
import { Click, Link } from "./get-users.interface";

export interface ResponseGetUsersInterface {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: Role;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: null;
  picture: null;
  provider: string;
  clicks: Click[];
  links: Link[];
}

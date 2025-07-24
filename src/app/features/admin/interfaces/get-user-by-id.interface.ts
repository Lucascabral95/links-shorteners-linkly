import { Link } from "../../links/interfaces";
import { Click } from "./get-all-users.interface";

export interface GetUserByIdInterface {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: string | null;
  picture: string | null;
  provider: string;
  links: Link[];
  clicks: Click[];
}

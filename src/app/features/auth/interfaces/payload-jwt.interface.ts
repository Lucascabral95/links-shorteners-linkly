import { Role } from "./create-auth-register.interface";

export default interface PayloadJWTInterface {
  id: string;
  email: string;
  role: Role;
  verified: boolean;
  full_name: string;
  picture?: string;
  googleId?: string;
  created_at: string;
}

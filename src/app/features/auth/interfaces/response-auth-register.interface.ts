export interface ResponseAuthRegisterInterface {
  userCreated: UserCreated;
  message: string;
}

export interface UserCreated {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  googleId: null;
  picture: null;
  provider: string;
}

export interface PasswordVerifyLinkInterface {
  password: string;
}

export interface ResponseVerifyLinkInterface {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  verified: boolean;
  link: string;
}

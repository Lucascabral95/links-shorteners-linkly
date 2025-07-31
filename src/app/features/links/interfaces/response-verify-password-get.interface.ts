export interface ResponseVerifyPasswordGetInterface {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  verified: boolean;
  link: string;
}

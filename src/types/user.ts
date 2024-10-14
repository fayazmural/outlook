export interface User {
  id?: string;
  name?: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string | null;
}

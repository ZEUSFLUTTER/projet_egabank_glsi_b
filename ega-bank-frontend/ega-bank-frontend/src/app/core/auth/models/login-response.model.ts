export interface LoginResponse {
  token: string;
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  clientId: number | null;
}
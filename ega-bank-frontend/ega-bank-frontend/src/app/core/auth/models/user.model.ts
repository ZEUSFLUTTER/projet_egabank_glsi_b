export interface User {
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  clientId?: number | null;
}
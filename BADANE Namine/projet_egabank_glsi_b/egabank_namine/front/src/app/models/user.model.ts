export interface User {
  id: number;
  username: string;
  password: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  enabled: boolean;
  createdAt: Date;
}
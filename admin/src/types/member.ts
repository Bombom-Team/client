export interface Member {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

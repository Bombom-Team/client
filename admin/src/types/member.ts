export interface Member {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
}

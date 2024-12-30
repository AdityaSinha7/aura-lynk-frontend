export interface User {
  email: string;
  name: string;
  role: 'USER' | 'PREMIUM_USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: User['role'];
} 
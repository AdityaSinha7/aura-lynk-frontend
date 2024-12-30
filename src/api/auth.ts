import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: 'USER' | 'PREMIUM_USER' | 'ADMIN';
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, credentials);
  return response.data;
};

export const googleLogin = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/google/login`, { token });
  return response.data;
}; 
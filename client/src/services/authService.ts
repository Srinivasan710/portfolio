import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      identifier,
      password,
    });
    const data = res.data.data!;
    localStorage.setItem('portfolio_token', data.token);
    localStorage.setItem('portfolio_user', JSON.stringify(data.user));
    return data;
  },

  async me(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    const user = res.data.data!;
    localStorage.setItem('portfolio_user', JSON.stringify(user));
    return user;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    const res = await api.put<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data.message;
  },

  logout(): void {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
  },

  getToken(): string | null {
    return localStorage.getItem('portfolio_token');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('portfolio_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('portfolio_token');
  }
};

import { apiClient } from './client';
import { User } from '../store/slices/authSlice';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  async getProfile(token: string): Promise<User> {
    const response = await apiClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch('/auth/profile', updates);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', {
      email,
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/account');
  },
};

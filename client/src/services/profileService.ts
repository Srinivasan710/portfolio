import api from './api';
import { ApiResponse, Profile } from '../types';

export const profileService = {
  async getProfile(): Promise<Profile> {
    const res = await api.get<ApiResponse<Profile>>('/profile');
    return res.data.data!;
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const res = await api.put<ApiResponse<Profile>>('/profile', updates);
    return res.data.data!;
  },
};

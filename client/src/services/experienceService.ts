import api from './api';
import { ApiResponse, Experience } from '../types';

export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    const res = await api.get<ApiResponse<Experience[]>>('/experiences');
    return res.data.data ?? [];
  },

  getById: async (id: string): Promise<Experience> => {
    const res = await api.get<ApiResponse<Experience>>(`/experiences/${id}`);
    return res.data.data!;
  },

  create: async (data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> => {
    const res = await api.post<ApiResponse<Experience>>('/experiences', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<Experience>): Promise<Experience> => {
    const res = await api.put<ApiResponse<Experience>>(`/experiences/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/experiences/${id}`);
  }
};

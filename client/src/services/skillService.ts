import api from './api';
import { ApiResponse, Skill } from '../types';

export const skillService = {
  getAll: async (category?: string): Promise<Skill[]> => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get<ApiResponse<Skill[]>>(`/skills${params}`);
    return res.data.data ?? [];
  },

  create: async (data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> => {
    const res = await api.post<ApiResponse<Skill>>('/skills', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<Skill>): Promise<Skill> => {
    const res = await api.put<ApiResponse<Skill>>(`/skills/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/skills/${id}`);
  }
};

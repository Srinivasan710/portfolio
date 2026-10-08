import api from './api';
import { ApiResponse, Education } from '../types';

export const educationService = {
  async getAll(): Promise<Education[]> {
    const res = await api.get<ApiResponse<Education[]>>('/educations');
    return res.data.data || [];
  },

  async getById(id: string): Promise<Education> {
    const res = await api.get<ApiResponse<Education>>(`/educations/${id}`);
    return res.data.data!;
  },

  async create(data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    const res = await api.post<ApiResponse<Education>>('/educations', data);
    return res.data.data!;
  },

  async update(id: string, updates: Partial<Education>): Promise<Education> {
    const res = await api.put<ApiResponse<Education>>(`/educations/${id}`, updates);
    return res.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/educations/${id}`);
  }
};

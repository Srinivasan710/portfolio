import api from './api';
import { ApiResponse, Project } from '../types';

export const projectService = {
  getAll: async (filters?: { category?: string; featured?: boolean }): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    const res = await api.get<ApiResponse<Project[]>>(`/projects?${params.toString()}`);
    return res.data.data ?? [];
  },

  getById: async (id: string): Promise<Project> => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data!;
  },

  create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const res = await api.post<ApiResponse<Project>>('/projects', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

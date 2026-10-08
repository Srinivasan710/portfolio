import api from './api';
import { ApiResponse, Service } from '../types';

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    const res = await api.get<ApiResponse<Service[]>>('/services');
    return res.data.data ?? [];
  },
};

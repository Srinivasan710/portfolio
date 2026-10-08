import api from './api';
import { ApiResponse, ContactFormData, ContactMessage } from '../types';

export const contactService = {
  submit: async (data: ContactFormData): Promise<string> => {
    const res = await api.post<ApiResponse>('/contact', data);
    return res.data.message;
  },

  getAll: async (): Promise<ContactMessage[]> => {
    const res = await api.get<ApiResponse<ContactMessage[]>>('/contact');
    return res.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
  }
};

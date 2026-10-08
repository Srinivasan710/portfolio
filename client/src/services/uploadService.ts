import api from './api';
import { ApiResponse } from '../types';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<ApiResponse<UploadResult>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data!;
  }
};

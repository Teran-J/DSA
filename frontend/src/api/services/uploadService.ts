import { apiClient } from '../client';
import type { UploadResponse } from '../../types/api';

export const uploadService = {
    async uploadImage(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};

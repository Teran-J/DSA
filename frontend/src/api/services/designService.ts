import { apiClient } from '../client';
import type { CreateDesignRequest, CreateDesignResponse, Design, UserDesignsResponse } from '../../types/api';

export const designService = {
    async create(data: CreateDesignRequest): Promise<CreateDesignResponse> {
        const response = await apiClient.post<CreateDesignResponse>('/designs', data);
        return response.data;
    },

    async getById(id: number): Promise<Design> {
        const response = await apiClient.get<Design>(`/designs/${id}`);
        return response.data;
    },

    async getMyDesigns(): Promise<UserDesignsResponse> {
        const response = await apiClient.get<UserDesignsResponse>('/designs/user/me');
        return response.data;
    },

    async getPendingDesigns(): Promise<UserDesignsResponse> {
        const response = await apiClient.get<UserDesignsResponse>('/designs/pending/all');
        return response.data;
    },
};

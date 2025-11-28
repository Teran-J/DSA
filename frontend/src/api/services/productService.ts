import { apiClient } from '../client';
import type { Product, ProductListResponse } from '../../types/api';

export const productService = {
    async getAll(category?: string): Promise<ProductListResponse> {
        const params = category ? { category } : {};
        const response = await apiClient.get<ProductListResponse>('/products', { params });
        return response.data;
    },

    async getById(id: number): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },
};

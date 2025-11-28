import { apiClient } from '../client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../../types/api';

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    },
};

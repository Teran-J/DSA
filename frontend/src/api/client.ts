import axios from 'axios';

// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token automatically
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear storage and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/services/authService';
import type { User, Role } from '../types/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { token, user } = await authService.login({ email, password });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const register = async (email: string, password: string, name?: string) => {
        const { token, user } = await authService.register({ email, password, name });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const hasRole = (role: Role): boolean => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                hasRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

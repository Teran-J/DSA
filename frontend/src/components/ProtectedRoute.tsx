import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

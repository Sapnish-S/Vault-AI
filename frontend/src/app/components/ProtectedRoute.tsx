import React from 'react';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wraps a route so it's only accessible when a user session exists in localStorage.
 * If no session is found (e.g. direct URL access), redirects to the login page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = localStorage.getItem('user');

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

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
    const [isValid, setIsValid] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token || token === 'null' || token === 'undefined') {
            setIsValid(false);
            return;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            const decodedJson = atob(payloadBase64);
            const payload = JSON.parse(decodedJson);
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                setIsValid(false);
                return;
            }
        } catch (e) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setIsValid(false);
            return;
        }

        setIsValid(true);
    }, []);

    if (isValid === null) {
        return <div className="w-full h-screen bg-[#05070A] flex items-center justify-center pointer-events-none" />;
    }

    if (isValid === false) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

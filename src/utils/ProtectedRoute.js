import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, roleRequired }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('ProtectedRoute check:', {
        token: token ? 'Present' : 'Missing',
        role,
        roleRequired,
        path: window.location.pathname
    });

    if (!token || !role) {
        console.log('No token or role found, redirecting to login');
        return <Navigate to="/login" />;
    }

    // Normalize roles to lowercase for comparison
    const normalizedRole = role.toLowerCase();
    const normalizedRequiredRole = roleRequired.toLowerCase();

    if (normalizedRole !== normalizedRequiredRole) {
        console.log(`Role mismatch: ${normalizedRole} !== ${normalizedRequiredRole}, redirecting to dashboard`);
        return <Navigate to={`/${normalizedRole}/dashboard`} />;
    }

    console.log('Access granted to protected route');
    return children;
}

export default ProtectedRoute;
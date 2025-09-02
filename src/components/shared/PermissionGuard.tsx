import React from 'react';
import { Navigate } from 'react-router';
import { useUserContext } from '../../providers/user';

interface PermissionGuardProps {
    children: React.ReactNode;
    module: string;
    action?: string;
    fallback?: React.ReactNode;
}

export default function PermissionGuard({
    children,
    module,
    action = 'read',
    fallback,
}: PermissionGuardProps) {
    const { hasPermission, loading } = useUserContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!hasPermission(module, action)) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
} 
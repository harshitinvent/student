import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserPermissions } from '../types/role';
import { userRoleAPI, permissionHelper } from '../services/roleAPI';

export type CatalogListType = 'Grid' | 'List';

const UserContext = createContext<{
    type: 'Admin' | 'Teacher' | 'Student' | null;
    setType: (type: 'Admin' | 'Teacher' | 'Student' | null) => void;
    catalogListType: CatalogListType;
    setCatalogListType: (type: CatalogListType) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    userPermissions: UserPermissions | null;
    setUserPermissions: (permissions: UserPermissions | null) => void;
    hasPermission: (module: string, action: string) => boolean;
    hasModuleAccess: (module: string) => boolean;
    getAccessibleModules: () => string[];
    loading: boolean;
} | null>(null);

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) throw new Error('Must be used inside <UserContext />');
    return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const [type, setType] = useState<'Admin' | 'Teacher' | 'Student' | null>(null);
    const [catalogListType, setCatalogListType] = useState<CatalogListType>('Grid');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserPermissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail');

            console.log('Loading permissions for user:', userEmail);

            if (token && userEmail) {
                // Check if user is admin@yopmail.com
                console.log('Current user email:', userEmail);

                if (userEmail === 'admin@yopmail.com') {
                    console.log('Admin user detected, giving full access');
                    // Give full access to admin@yopmail.com
                    const adminPermissions = {
                        userId: 'admin-user',
                        permissions: [
                            { module: 'dashboard', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'departments', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'students', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'teachers', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'program-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'course-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'assignments', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'financial-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'financial-transactions', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'vendor-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'invoice-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'user-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'role-management', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'accommodations', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'calendar', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'chat', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'settings', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'reports', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'whiteboard', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'offices', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'notifications', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'admissions', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'announcements', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'payment-reports', permissions: { read: true, write: true, delete: true, create: true } },
                            { module: 'fee-structure', permissions: { read: true, write: true, delete: true, create: true } }
                        ]
                    };
                    console.log('Setting admin permissions:', adminPermissions);
                    setUserPermissions(adminPermissions);
                } else {
                    console.log('Regular user, loading permissions from API...');
                    // For other users, load from API
                    const permissions = await userRoleAPI.getCurrentUserPermissions();
                    console.log('User permissions loaded:', permissions);

                    if (permissions && permissions.permissions) {
                        setUserPermissions(permissions);
                    } else {
                        console.log('No permissions found, using default limited access');
                        // Set limited access for users without permissions
                        setUserPermissions({
                            userId: 'regular-user',
                            permissions: [
                                { module: 'dashboard', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'departments', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'students', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'teachers', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'program-management', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'course-management', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'assignments', permissions: { read: true, write: true, delete: false, create: true } },
                                { module: 'financial-management', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'financial-transactions', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'vendor-management', permissions: { read: false, write: false, delete: false, create: false } },
                                { module: 'invoice-management', permissions: { read: false, write: false, delete: false, create: false } },
                                { module: 'user-management', permissions: { read: false, write: false, delete: false, create: false } },
                                { module: 'role-management', permissions: { read: false, write: false, delete: false, create: false } },
                                { module: 'accommodations', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'calendar', permissions: { read: true, write: true, delete: false, create: true } },
                                { module: 'chat', permissions: { read: true, write: true, delete: false, create: true } },
                                { module: 'settings', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'reports', permissions: { read: true, write: false, delete: false, create: false } },
                                { module: 'whiteboard', permissions: { read: true, write: true, delete: false, create: true } },
                                { module: 'offices', permissions: { read: true, write: true, delete: false, create: true } }
                            ]
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error loading user permissions:', error);
            console.log('Using limited permissions for development');
            // Set limited permissions for development/testing (non-admin users)
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'admin@yopmail.com') {
                // Full access for admin
                setUserPermissions({
                    userId: 'admin-user',
                    permissions: [
                        { module: 'dashboard', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'departments', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'students', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'teachers', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'program-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'course-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'assignments', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'financial-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'financial-transactions', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'vendor-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'invoice-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'user-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'role-management', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'accommodations', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'calendar', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'chat', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'settings', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'reports', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'whiteboard', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'offices', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'notifications', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'admissions', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'announcements', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'payment-reports', permissions: { read: true, write: true, delete: true, create: true } },
                        { module: 'fee-structure', permissions: { read: true, write: true, delete: true, create: true } }
                    ]
                });
            } else {
                // Limited access for other users
                setUserPermissions({
                    userId: 'regular-user',
                    permissions: [
                        { module: 'dashboard', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'departments', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'students', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'teachers', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'course-management', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'assignments', permissions: { read: true, write: true, delete: false, create: true } },
                        { module: 'financial-management', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'financial-transactions', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'vendor-management', permissions: { read: false, write: false, delete: false, create: false } },
                        { module: 'invoice-management', permissions: { read: false, write: false, delete: false, create: false } },
                        { module: 'user-management', permissions: { read: false, write: false, delete: false, create: false } },
                        { module: 'role-management', permissions: { read: false, write: false, delete: false, create: false } },
                        { module: 'accommodations', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'calendar', permissions: { read: true, write: true, delete: false, create: true } },
                        { module: 'chat', permissions: { read: true, write: true, delete: false, create: true } },
                        { module: 'settings', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'reports', permissions: { read: true, write: false, delete: false, create: false } },
                        { module: 'whiteboard', permissions: { read: true, write: true, delete: false, create: true } }
                    ]
                });
            }
        }
    };

    const hasPermission = (module: string, action: string): boolean => {
        if (!userPermissions) return false;
        return permissionHelper.hasPermission(userPermissions, module, action);
    };

    const hasModuleAccess = (module: string): boolean => {
        // return true
        if (!userPermissions || !userPermissions.permissions) return false;
        return permissionHelper.hasModuleAccess(userPermissions, module);
    };

    const getAccessibleModules = (): string[] => {
        if (!userPermissions || !userPermissions.permissions) return [];
        return permissionHelper.getAccessibleModules(userPermissions);
    };

    useEffect(() => {
        function checkAuth() {
            const token = localStorage.getItem('token');
            const userType = localStorage.getItem('userType');
            const userEmail = localStorage.getItem('userEmail');

            console.log('Checking auth - Token:', !!token, 'UserType:', userType, 'Email:', userEmail);

            if (token) {
                setIsAuthenticated(true);
                if (userType) setType(userType as 'Student' | 'Teacher' | 'Admin');
                // Clear previous permissions before loading new ones
                setUserPermissions(null);
                // Load permissions immediately
                loadUserPermissions();
            } else {
                console.log('No token found, clearing user context');
                setIsAuthenticated(false);
                setType(null);
                setUserPermissions(null);
            }
            setLoading(false);
        }
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [isAuthenticated]); // Add isAuthenticated as dependency

    if (loading) return null;

    return (
        <UserContext.Provider
            value={{
                type,
                setType,
                catalogListType,
                setCatalogListType,
                isAuthenticated,
                setIsAuthenticated,
                userPermissions,
                setUserPermissions,
                hasPermission,
                hasModuleAccess,
                getAccessibleModules,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
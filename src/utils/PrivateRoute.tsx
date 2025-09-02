import { Navigate, Outlet } from 'react-router';
import { useUserContext } from '../providers/user';

export default function PrivateRoute() {
    const { isAuthenticated } = useUserContext();


    console.log(isAuthenticated, 'isAuthenticated')

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
} 
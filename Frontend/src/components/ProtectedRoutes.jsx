import {Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoutes = ({children, allowedRoles}) => {

    const {user, loading} = useAuth();

    if(loading) return <div>Loading...</div>;

    if(!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
export default ProtectedRoutes;
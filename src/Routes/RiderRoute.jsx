import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const RiderRoute = ({children}) => {
    const{user, loading} = useAuth();
    const{role, roleLoading} = useUserRole();
    const location= useLocation();
    if(roleLoading || loading) return <span className="loading loading-dots loading-lg"></span>;
    if(user && role === "rider"){
        return children;
    }
    return <Navigate state={location.pathname} to="/forbidden"></Navigate>
};

export default RiderRoute;
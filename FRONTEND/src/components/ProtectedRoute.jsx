import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children, allowedRoles, user }) {
    const normalize = (r) => {
        if (!r) return null;
        const lower = String(r).toLowerCase();
        if (lower === 'normal user') return 'user';
        return lower;
    };
    const role = normalize(user?.role);
    if (user === null) return null;
    if (!user || !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
    return children;
}



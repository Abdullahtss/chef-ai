import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * PublicRoute component - Redirects authenticated users away from public routes
 * Used for routes like /login that should only be accessible to unauthenticated users
 */
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="spinner-large"></div>
            </div>
        );
    }

    // If authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    // If not authenticated, allow access to public route
    return children;
}

export default PublicRoute;


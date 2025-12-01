import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, getToken, initializeAuth, logout as authLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize auth on mount - load user from localStorage
        initializeAuth();
        const currentUser = getCurrentUser();
        const token = getToken();
        
        // Only set user if both token and user data exist
        if (token && currentUser) {
            setUser(currentUser);
        } else {
            // Clear any stale data
            if (!token) {
                authLogout();
            }
        }
        setLoading(false);
    }, []);

    // Listen for storage changes (e.g., logout in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                const currentUser = getCurrentUser();
                const token = getToken();
                
                if (token && currentUser) {
                    setUser(currentUser);
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user && !!getToken(),
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

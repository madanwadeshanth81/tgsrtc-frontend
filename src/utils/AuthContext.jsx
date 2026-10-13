import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = api.getCurrentUser();
        const token = localStorage.getItem('tgsrtc_token');
        if (storedUser && token) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await api.login(email, password);
        if (data.success && data.user) {
            setUser(data.user);
        }
        return data;
    };

    const register = async (userData) => {
        const data = await api.register(userData);
        if (data.success && data.user) {
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

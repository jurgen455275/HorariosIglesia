import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        setToken(response.data.token);
    };

    const register = async (username, password) => {
        const response = await api.post('/auth/register', { username, password });
        setToken(response.data.token);
    };

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

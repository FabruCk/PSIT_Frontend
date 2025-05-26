import api from './api';
import { AUTH_ENDPOINTS } from './endpoints';

export const login = async (credentials) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
        refresh: refreshToken
    });
    
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
    }
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get(AUTH_ENDPOINTS.CURRENT_USER);
    return response.data;
}; 
import API from './api';

// ---- Getters ----
export const getToken  = () => localStorage.getItem('token');
export const getRole   = () => localStorage.getItem('role');
export const getName   = () => localStorage.getItem('name');
export const getUserId = () => localStorage.getItem('userId');

// ---- Logout ----
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
};

// ---- Save Auth Data (helper) ----
const saveAuthData = (data) => {
    localStorage.setItem('token',  data.token);
    localStorage.setItem('role',   data.role);
    localStorage.setItem('name',   data.name);
    localStorage.setItem('userId', data.userId || data.id || '1');
};

// ---- Register ----
export const register = async (data) => {
    const response = await API.post('/api/auth/register', data);
    saveAuthData(response.data);
    return response.data;
};

// ---- Login ----
export const login = async (data) => {
    const response = await API.post('/api/auth/login', data);
    saveAuthData(response.data);
    return response.data;
};
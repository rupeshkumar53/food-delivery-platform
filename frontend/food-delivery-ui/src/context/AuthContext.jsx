import React, { createContext, useState, useContext } from "react";
import { getToken, getRole, getName, getUserId, logout } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken());
    const [role, setRole] = useState(getRole());
    const [name, setName] = useState(getName());
    const [userId, setUserId] = useState(getUserId());

    const handleLogin = (data) => {
        setToken(data.token);
        setRole(data.role);
        setName(data.name);
        setUserId(data.userId || data.id || "1");
    };

    const handleLogout = () => {
        logout();
        setToken(null); setRole(null); setName(null); setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, name, userId, handleLogin, handleLogout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
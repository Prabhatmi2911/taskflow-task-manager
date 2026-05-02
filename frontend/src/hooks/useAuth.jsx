import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const _saveSession = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(token);
    setUser(userInfo);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, username, email } = response.data.data;
      _saveSession(newToken, { username, email });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      const { token: newToken, username, email, message } = response.data.data;
      _saveSession(newToken, { username, email });
      return { success: true, message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      // Handle validation errors (field-level)
      const fieldErrors = err.response?.data?.data;
      return { success: false, message, fieldErrors };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!token && !!user,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
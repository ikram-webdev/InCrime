import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// 1. Base URL fix (Make sure it ends with /api)
axios.defaults.baseURL = 'https://incrime-server.onrender.com'; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('incrime_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data.success) setUser(data.user);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // 2. Login request handling with error catch
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('incrime_token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } catch (error) {
      // Throw error taake Login page par error message dikhayi de
      throw error.response ? error.response.data : new Error("Server Error");
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/register', formData);
      if (data.success) {
        localStorage.setItem('incrime_token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Registration Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem('incrime_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
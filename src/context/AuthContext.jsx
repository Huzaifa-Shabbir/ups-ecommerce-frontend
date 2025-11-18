import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(undefined);

const API_AUTH_BASE = 'http://localhost:4000/api/auth';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  // Helper: parse JSON when appropriate, otherwise throw informative error
  const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    } else {
      // read body text for debugging (may be HTML error page)
      const text = await response.text().catch(() => '');
      throw new Error(`Server returned non-JSON response (status ${response.status}). Response body starts with: ${text.slice(0, 200)}`);
    }
  };

  const login = useCallback(async (identifier, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // receive refresh token cookie
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Login failed (status ${res.status})` }));
        throw new Error(payload.message || `Login failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      const authToken = data.token;
      const userData = data.user || null;

      if (!authToken) {
        throw new Error('Invalid login response: missing token');
      }

      setAccessToken(authToken);
      localStorage.setItem('accessToken', authToken);

      setUser(userData);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_AUTH_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Registration failed (status ${res.status})` }));
        throw new Error(payload.message || `Registration failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_AUTH_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

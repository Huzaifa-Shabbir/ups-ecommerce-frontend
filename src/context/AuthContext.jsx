import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(undefined);

const API_AUTH_BASE = 'http://localhost:4000/api/auth';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const user = JSON.parse(stored);
    // Normalize user_Id to user_id for consistency
    if (user && user.user_Id && !user.user_id) {
      user.user_id = user.user_Id;
    }
    return user;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
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

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_AUTH_BASE}/login/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // receive refresh token cookie
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Login failed (status ${res.status})` }));
        throw new Error(payload.message || `Login failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      
      if (!data.success || !data.user) {
        throw new Error('Invalid login response: missing user data');
      }

      // Normalize user_Id to user_id for consistency
      const userData = data.user;
      if (userData.user_Id) {
        userData.user_id = userData.user_Id;
      }

      // Note: The new API doesn't return a token in the response
      // Token might be in cookies, headers, or handled via sessions
      // Check for token in response or cookies
      const authToken = data.token || data.accessToken || null;
      
      // If no token in response, try to get from response headers
      if (!authToken) {
        const tokenHeader = res.headers.get('Authorization') || res.headers.get('X-Auth-Token');
        if (tokenHeader) {
          const token = tokenHeader.replace('Bearer ', '');
          setAccessToken(token);
          localStorage.setItem('accessToken', token);
        }
      } else {
        setAccessToken(authToken);
        localStorage.setItem('accessToken', authToken);
      }

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

  const register = useCallback(async (name, email, username, password, phone_Number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, phone_Number }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Registration failed (status ${res.status})` }));
        throw new Error(payload.message || `Registration failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      
      // Normalize user_Id to user_id if customer data exists
      if (data.customer && data.customer.user_Id) {
        data.customer.user_id = data.customer.user_Id;
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, new_password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_AUTH_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Password reset failed (status ${res.status})` }));
        throw new Error(payload.message || `Password reset failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      return data;
    } catch (err) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (email, oldPassword, newPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_AUTH_BASE}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      if (!res.ok) {
        const payload = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : Promise.resolve({ message: `Password change failed (status ${res.status})` }));
        throw new Error(payload.message || `Password change failed (status ${res.status})`);
      }

      const data = await parseResponse(res);
      
      // Update user data if returned
      if (data.user) {
        const userData = data.user;
        // Normalize user_Id to user_id
        if (userData.user_Id) {
          userData.user_id = userData.user_Id;
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Password change failed');
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
    <AuthContext.Provider value={{ user, setUser, accessToken, isLoading, error, login, register, resetPassword, changePassword, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

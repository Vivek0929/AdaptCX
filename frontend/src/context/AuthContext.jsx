import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adaptcx_auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('adaptcx_auth_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.business) {
            setBusiness(res.data.business);
            setToken(savedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: newToken, business: loggedInBusiness } = res.data;
    localStorage.setItem('adaptcx_auth_token', newToken);
    localStorage.setItem('adaptcx_business', JSON.stringify(loggedInBusiness));
    setToken(newToken);
    setBusiness(loggedInBusiness);
    return loggedInBusiness;
  };

  const signup = async (signupData) => {
    const res = await authApi.signup(signupData);
    const { token: newToken, business: newBusiness } = res.data;
    localStorage.setItem('adaptcx_auth_token', newToken);
    localStorage.setItem('adaptcx_business', JSON.stringify(newBusiness));
    setToken(newToken);
    setBusiness(newBusiness);
    return newBusiness;
  };

  const logout = () => {
    localStorage.removeItem('adaptcx_auth_token');
    localStorage.removeItem('adaptcx_business');
    setToken(null);
    setBusiness(null);
  };

  const updateBusinessProfile = async (updates) => {
    const res = await authApi.updateProfile(updates);
    if (res.data && res.data.business) {
      setBusiness(res.data.business);
      localStorage.setItem('adaptcx_business', JSON.stringify(res.data.business));
      return res.data.business;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        business,
        token,
        isAuthenticated: !!token && !!business,
        loading,
        login,
        signup,
        logout,
        updateBusinessProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

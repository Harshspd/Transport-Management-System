"use client"

import React, { useEffect, useState } from 'react';
import { AuthConfig } from './auth/config';
import { AuthUser } from './auth/types';
import { createAuthProvider } from './auth';
import { AuthContext } from './auth/AuthContext';

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<AuthConfig>;
}> = ({ children, config = {} }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authProvider = createAuthProvider(config);
  
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const user = await authProvider.getUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await authProvider.login(email, password);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };
  
  const register = async (userData: Record<string, any>) => {
    const response = await authProvider.register(userData);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };
  
  const logout = async () => {
    const success = await authProvider.logout();
    if (success) {
      setUser(null);
    }
    return success;
  };

  // Optional: Add more auth-related functions
  const refreshToken = async () => {
    // Implementation depends on your auth provider
    return false;
  };

  const resetPassword = async (email: string) => {
    // This would call the appropriate endpoint on your auth provider
    return { success: false, error: 'Not implemented' };
  };

  const updateProfile = async (userData: Partial<AuthUser>) => {
    // Implementation for updating user profile
    return { success: false, error: 'Not implemented' };
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        refreshToken,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
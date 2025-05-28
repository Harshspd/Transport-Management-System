import { createContext } from 'react';
import type { AuthUser, AuthResponse } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: Record<string, any>) => Promise<AuthResponse>;
  logout: () => Promise<boolean>;
  // You can add more auth-related functions here as needed
  refreshToken?: () => Promise<boolean>;
  resetPassword?: (email: string) => Promise<AuthResponse>;
  updateProfile?: (userData: Partial<AuthUser>) => Promise<AuthResponse>;
}

// Default values when context is used outside provider
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => ({ success: false, error: 'Auth not initialized' }),
  register: async () => ({ success: false, error: 'Auth not initialized' }),
  logout: async () => false,
  // Add default values for any additional functions
  refreshToken: async () => false,
  resetPassword: async () => ({ success: false, error: 'Auth not initialized' }),
  updateProfile: async () => ({ success: false, error: 'Auth not initialized' }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export a separate hook for importing context
import { useContext } from 'react';
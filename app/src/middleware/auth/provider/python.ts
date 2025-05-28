import type { AuthProvider, AuthResponse, AuthUser } from '../types';
import type { AuthConfig } from '../config';

export class PythonAuthProvider implements AuthProvider {
  private config: AuthConfig;
  
  constructor(config: AuthConfig) {
    this.config = config;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Python APIs might use different formats or have CORS considerations
      const response = await fetch(`${this.config.apiUrl}${this.config.endpoints?.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies for Python frameworks like Django/Flask
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem(this.config.tokenKey || 'auth_token', data.token);
      }
      
      return {
        success: response.ok,
        user: data.user,
        token: data.token,
        error: data.error || data.detail, // Many Python APIs use 'detail' for error messages
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async register(userData: Record<string, any>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}${this.config.endpoints?.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem(this.config.tokenKey || 'auth_token', data.token);
      }
      
      return {
        success: response.ok,
        user: data.user,
        token: data.token,
        error: data.error || data.detail,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (this.config.endpoints?.logout) {
        await fetch(`${this.config.apiUrl}${this.config.endpoints.logout}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(this.config.tokenKey || 'auth_token')}`,
          },
          credentials: 'include',
        });
      }
      
      localStorage.removeItem(this.config.tokenKey || 'auth_token');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  async getUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem(this.config.tokenKey || 'auth_token');
    if (!token) return null;

    try {
      const response = await fetch(`${this.config.apiUrl}${this.config.endpoints?.user}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}${this.config.endpoints?.verify}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      return false;
    }
  }
}

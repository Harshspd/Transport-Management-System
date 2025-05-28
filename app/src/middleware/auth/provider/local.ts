import type { AuthProvider, AuthResponse, AuthUser } from '../types';
import type { AuthConfig } from '../config';
import { decrypt, encrypt } from '../encryptionUtils';

interface EncryptedUser {
  data: string; // Encrypted JSON string of AuthUser & password
}

interface EncryptedToken {
  userId: string;
}

const USERS_STORE_KEY = 'app_users_encrypted';
const TOKENS_STORE_KEY = 'app_tokens_encrypted';

export class LocalAuthProvider implements AuthProvider {
  private config: AuthConfig;
  private encryptionKey: string; // Store the encryption key

  constructor(config: AuthConfig) {
    this.config = config;
    // In a real production scenario, this key should be managed securely
    // (e.g., environment variable, secret management service).
    // For this example, we'll use a simple key. DO NOT HARDCODE IN PRODUCTION.
    this.encryptionKey = config.encryptionKey || 'your-secret-encryption-key';
    if (this.encryptionKey === 'your-secret-encryption-key') {
      console.warn('Using a default encryption key. This is NOT secure for production.');
    }
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private loadUsers(): Record<string, AuthUser & { password: string }> {
    try {
      const encryptedData = localStorage.getItem(USERS_STORE_KEY);
      if (encryptedData) {
        const decryptedData = decrypt(encryptedData, this.encryptionKey);
        return JSON.parse(decryptedData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      localStorage.removeItem(USERS_STORE_KEY); // Clear potentially corrupted data
    }
    return {};
  }

  private saveUsers(users: Record<string, AuthUser & { password: string }>): void {
    try {
      const jsonData = JSON.stringify(users);
      const encryptedData = encrypt(jsonData, this.encryptionKey);
      localStorage.setItem(USERS_STORE_KEY, encryptedData);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private loadTokens(): Record<string, string> {
    try {
      const encryptedData = localStorage.getItem(TOKENS_STORE_KEY);
      if (encryptedData) {
        const decryptedData = decrypt(encryptedData, this.encryptionKey);
        return JSON.parse(decryptedData);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      localStorage.removeItem(TOKENS_STORE_KEY); // Clear potentially corrupted data
    }
    return {};
  }

  private saveTokens(tokens: Record<string, string>): void {
    try {
      const jsonData = JSON.stringify(tokens);
      const encryptedData = encrypt(jsonData, this.encryptionKey);
      localStorage.setItem(TOKENS_STORE_KEY, encryptedData);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const users = this.loadUsers();
    const user = Object.values(users).find(u => u.email === email);

    if (!user || user.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const token = this.generateToken();
    const tokens = this.loadTokens();
    tokens[token] = user.id;
    this.saveTokens(tokens);
    localStorage.setItem(this.config.tokenKey || 'auth_token', token);

    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  }

  async register(userData: Record<string, any>): Promise<AuthResponse> {
    
    const { email, password, ...otherData } = userData;
    const users = this.loadUsers();
    console.log(users, 'users');
    if (Object.values(users).some(u => u.email === email)) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      email,
      password,
      ...otherData,
    };

    users[userId] = newUser;
    this.saveUsers(users);

    const token = this.generateToken();
    const tokens = this.loadTokens();
    tokens[token] = userId;
    this.saveTokens(tokens);
    localStorage.setItem(this.config.tokenKey || 'auth_token', token);

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  }

  async logout(): Promise<boolean> {
    const token = localStorage.getItem(this.config.tokenKey || 'auth_token');

    if (token) {
      const tokens = this.loadTokens();
      delete tokens[token];
      this.saveTokens(tokens);
      localStorage.removeItem(this.config.tokenKey || 'auth_token');
    }

    return true;
  }

  async getUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem(this.config.tokenKey || 'auth_token');
    if (!token) return null;

    const tokens = this.loadTokens();
    const userId = tokens[token];
    if (!userId) return null;

    const users = this.loadUsers();
    const user = users[userId];
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async verifyToken(token: string): Promise<boolean> {
    const tokens = this.loadTokens();
    return !!tokens[token];
  }
}


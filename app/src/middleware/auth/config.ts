export type AuthBackendType = 'node' | 'python' | 'local';

export interface AuthConfig {
  backendType: AuthBackendType;
  apiUrl?: string;
  tokenKey?: string;
  endpoints?: {
    login?: string;
    register?: string;
    logout?: string;
    verify?: string;
    user?: string;
  };
  encryptionKey?:string
}

export const defaultConfig: AuthConfig = {
  backendType: 'local',
  apiUrl: '/api/auth',
  tokenKey: 'auth_token',
  endpoints: {
    login: 'auth/login',
    register: 'auth/register',
    logout: '/logout',
    verify: '/verify',
    user: '/user'
  }
};
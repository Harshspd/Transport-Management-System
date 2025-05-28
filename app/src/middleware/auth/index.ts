import { AuthConfig, defaultConfig } from './config';
import { LocalAuthProvider } from './provider/local';
import { NodeAuthProvider } from './provider/node';
import { PythonAuthProvider } from './provider/python';
import type { AuthProvider } from './types';

export const createAuthProvider = (config: Partial<AuthConfig> = {}): AuthProvider => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  switch (mergedConfig.backendType) {
    case 'node':
      return new NodeAuthProvider(mergedConfig);
    case 'python':
      return new PythonAuthProvider(mergedConfig);
    case 'local':
      return new LocalAuthProvider(mergedConfig);
    default:
      throw new Error(`Unknown auth backend type: ${mergedConfig.backendType}`);
  }
};
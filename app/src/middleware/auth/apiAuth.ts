import { NextApiRequest, NextApiResponse } from 'next';
import type { AuthConfig } from './config';
import { createAuthProvider } from './index';

export function withApiAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, userId: string) => Promise<void> | void,
  config: Partial<AuthConfig> = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const authProvider = createAuthProvider({
        ...config,
        backendType: process.env.AUTH_BACKEND as any || 'node',
        apiUrl: process.env.API_URL || '/api/auth',
      });

      const isValid = await authProvider.verifyToken(token);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Get user ID from token
      // This is a simplified example - you'll need to extract the user ID based on your token implementation
      const userId = 'user-id'; // Replace with actual user ID extraction

      // Continue to the API handler with the authenticated user ID
      return await handler(req, res, userId);
    } catch (error) {
      console.error('API auth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
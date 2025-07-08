export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    role?: string;
    fname?:string;
    lname?:string;
    phone?: string;
    organizationId?: string; // Account ID
    
    // Add any other user fields you need
  }
  
  export interface AuthResponse {
    success: boolean;
    user?: AuthUser;
    token?: string;
    error?: string;
  }
  
  export interface AuthProvider {
    login(email: string, password: string): Promise<AuthResponse>;
    register(userData: Record<string, any>): Promise<AuthResponse>;
    logout(): Promise<boolean>;
    getUser(): Promise<AuthUser | null>;
    verifyToken(token: string): Promise<boolean>;
  }
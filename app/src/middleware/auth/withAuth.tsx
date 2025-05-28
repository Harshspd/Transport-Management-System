import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';


// This HOC doesn't apply any layout - it just handles auth protection
export const withAuth = (Component: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!loading && !user) {
        router.push('/sign?redirect=' + encodeURIComponent(router.asPath));
      }
    }, [user, loading, router]);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      );
    }
    
    if (!user) {
      return null; // Will redirect in useEffect
    }
    
    return <Component {...props} />;
  };
  
  return AuthenticatedComponent;
};
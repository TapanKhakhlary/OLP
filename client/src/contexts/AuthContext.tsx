import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../lib/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, parentCode?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const userData = await authAPI.getMe();
        if (userData?.user) {
          setUser({
            id: userData.user.id,
            name: userData.user.name,
            email: userData.user.email,
            role: userData.user.role as UserRole,
            createdAt: new Date(userData.user.createdAt),
          });
        }
      } catch (error) {
        // User not authenticated, this is fine
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);



  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const userData = await authAPI.login({ email, password });
      
      setUser({
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        role: userData.user.role as UserRole,
        createdAt: new Date(userData.user.createdAt),
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    }
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    parentCode?: string
  ) => {
    try {
      setError(null);
      const userData = await authAPI.signup({ name, email, password, role });
      
      setUser({
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        role: userData.user.role as UserRole,
        createdAt: new Date(userData.user.createdAt),
      });

      // Handle role-specific logic
      if (role === 'parent' && parentCode) {
        await linkToChild(userData.user.id, parentCode);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await authAPI.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
    }
  }, []);



  const linkToChild = async (parentId: string, childEmail: string) => {
    // Find child by email (this would need to be implemented based on your requirements)
    // For now, we'll skip this implementation
    console.log('Linking parent to child:', parentId, childEmail);
  };

  const isAuthenticated = user !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-800 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
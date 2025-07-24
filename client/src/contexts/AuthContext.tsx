import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, classCode?: string, parentCode?: string) => Promise<void>;
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
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Authentication state change failed');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setError(null);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        setError('Failed to fetch user profile');
        setLoading(false);
        return;
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: '', // We'll get this from auth.user if needed
          role: profile.role as UserRole,
          createdAt: new Date(profile.created_at),
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // User profile will be fetched automatically by the auth state change listener
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            role,
          });

        if (profileError) throw profileError;

        // Handle role-specific logic
        if (role === 'parent' && parentCode) {
          await linkToChild(data.user.id, parentCode);
        }

        // User profile will be fetched automatically by the auth state change listener
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      throw error;
    }

  }, []);

  const logout = useCallback(() => {
    setError(null);
    supabase.auth.signOut();
  }, []);

  const joinClass = async (studentId: string, classCode: string) => {
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id')
      .eq('code', classCode)
      .single();

    if (classError || !classData) {
      throw new Error('Invalid class code');
    }

    const { error: enrollError } = await supabase
      .from('class_enrollments')
      .insert({
        class_id: classData.id,
        student_id: studentId,
      });

    if (enrollError) throw enrollError;
  };

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
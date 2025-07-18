import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, classCode?: string, parentCode?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

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
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // User profile will be fetched automatically by the auth state change listener
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    classCode?: string,
    parentCode?: string
  ) => {
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
      if (role === 'student' && classCode) {
        await joinClass(data.user.id, classCode);
      } else if (role === 'parent' && parentCode) {
        await linkToChild(data.user.id, parentCode);
      } else if (role === 'teacher') {
        // Teachers can create classes after signup
      }

      // User profile will be fetched automatically by the auth state change listener
    }
  }, []);

  const logout = useCallback(() => {
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
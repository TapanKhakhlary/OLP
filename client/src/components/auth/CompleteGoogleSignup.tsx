import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Users, Heart } from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';
import { useAuth } from '../../contexts/AuthContext';

const CompleteGoogleSignup: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('googleUserData');
    if (userData) {
      setGoogleUserData(JSON.parse(userData));
    } else {
      // No Google data, redirect to login
      window.location.href = '/auth/login';
    }
  }, []);

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !googleUserData) return;

    setIsLoading(true);
    setError(null);

    try {
      const newUser = await apiRequest('/auth/complete-google-signup', {
        method: 'POST',
        body: JSON.stringify({
          googleId: googleUserData.uid,
          email: googleUserData.email,
          name: googleUserData.name,
          profilePicture: googleUserData.photoURL,
          role: selectedRole
        })
      });

      // Clear stored Google data
      localStorage.removeItem('googleUserData');
      
      // Log in the new user - redirect to dashboard instead
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      setError(error.message || 'Failed to complete signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!googleUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4 w-fit">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Account</h2>
          <p className="text-gray-600 mb-6">
            Welcome, {googleUserData.name}! Please select your role to complete the setup.
          </p>
        </div>

        <form onSubmit={handleCompleteSignup} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            
            <div className="grid gap-3">
              <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedRole === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={selectedRole === 'student'}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    selectedRole === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Student</div>
                    <div className="text-sm text-gray-600">Join classes and complete assignments</div>
                  </div>
                </div>
                {selectedRole === 'student' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>

              <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedRole === 'teacher' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={selectedRole === 'teacher'}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    selectedRole === 'teacher' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Teacher</div>
                    <div className="text-sm text-gray-600">Create classes and manage students</div>
                  </div>
                </div>
                {selectedRole === 'teacher' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>

              <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedRole === 'parent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="parent"
                  checked={selectedRole === 'parent'}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    selectedRole === 'parent' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Parent</div>
                    <div className="text-sm text-gray-600">Monitor your child's progress</div>
                  </div>
                </div>
                {selectedRole === 'parent' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedRole || isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Complete Setup'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              localStorage.removeItem('googleUserData');
              window.location.href = '/auth/login';
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Use a different account
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteGoogleSignup;
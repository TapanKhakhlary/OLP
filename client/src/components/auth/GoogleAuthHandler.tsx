import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { handleGoogleRedirect, isFirebaseConfigured } from '../../firebase';
import { apiRequest } from '../../lib/queryClient';

const GoogleAuthHandler: React.FC = () => {
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processGoogleAuth();
  }, []);

  const processGoogleAuth = async () => {
    try {
      if (!isFirebaseConfigured) {
        window.location.href = '/auth/login';
        return;
      }
      
      const result = await handleGoogleRedirect();
      
      if (result) {
        // Check if user exists in our system
        try {
          const existingUser = await apiRequest('/auth/google-user', {
            method: 'POST',
            body: JSON.stringify({
              googleId: result.user.uid,
              email: result.user.email,
              name: result.user.name,
              photoURL: result.user.photoURL
            })
          });

          // User exists, log them in
          await login(existingUser.email, '');
          
        } catch (error: any) {
          if (error.message.includes('not found')) {
            // New user - redirect to role selection
            localStorage.setItem('googleUserData', JSON.stringify(result.user));
            window.location.href = '/auth/complete-signup';
          } else {
            throw error;
          }
        }
      } else {
        // No redirect result, redirect to login
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Google auth processing error:', error);
      setError('Failed to process Google authentication. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Google Sign-In</h2>
          <p className="text-gray-600">Please wait while we complete your authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="p-4 rounded-full bg-red-100 text-red-600 mx-auto mb-4 w-fit">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthHandler;
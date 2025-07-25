import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle, isFirebaseConfigured } from '../../firebase';
import { apiRequest } from '../../lib/queryClient';

interface GoogleSignInProps {
  mode?: 'signin' | 'signup';
  userRole?: 'student' | 'teacher' | 'parent';
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ mode = 'signin', userRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if Firebase is configured
      if (!isFirebaseConfigured) {
        alert('Google Sign-In requires Firebase configuration. Please add your Firebase credentials to the environment variables.');
        return;
      }
      
      // Redirect to Google for authentication
      await signInWithGoogle();
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle className="h-5 w-5 mr-3" />
      <span className="text-sm font-medium">
        {isLoading ? 'Redirecting...' : `${mode === 'signup' ? 'Sign up' : 'Continue'} with Google`}
      </span>
    </button>
  );
};

export default GoogleSignIn;
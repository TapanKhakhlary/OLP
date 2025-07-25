import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';

const GoogleSignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll show a message about Firebase setup
      alert('Google Sign-In requires Firebase configuration. Please set up Firebase Auth in your project settings.');
      
      // Future implementation would use Firebase Auth:
      /*
      import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
      import { auth } from '../../firebase';
      
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      */
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
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
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  );
};

export default GoogleSignIn;
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Route, Switch } from 'wouter';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/dashboard/student/StudentDashboard';
import TeacherDashboard from './components/dashboard/teacher/TeacherDashboard';
import ParentDashboard from './components/dashboard/parent/ParentDashboard';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleAuthHandler from './components/auth/GoogleAuthHandler';
import CompleteGoogleSignup from './components/auth/CompleteGoogleSignup';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Handle authentication routes first
  const currentPath = window.location.pathname;
  
  if (currentPath === '/auth/forgot-password') {
    return <ForgotPasswordPage />;
  }
  
  if (currentPath === '/auth/reset-password') {
    return <ResetPasswordPage />;
  }
  
  if (currentPath === '/auth/google/callback') {
    return <GoogleAuthHandler />;
  }
  
  if (currentPath === '/auth/complete-signup') {
    return <CompleteGoogleSignup />;
  }

  // Main application routing
  if (!user) {
    return <LandingPage />;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <LandingPage />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
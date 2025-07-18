import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/dashboard/student/StudentDashboard';
import TeacherDashboard from './components/dashboard/teacher/TeacherDashboard';
import ParentDashboard from './components/dashboard/parent/ParentDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
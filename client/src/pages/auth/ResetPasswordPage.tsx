import React from 'react';
import { useLocation } from 'wouter';
import ResetPassword from '../../components/auth/ResetPassword';

const ResetPasswordPage: React.FC = () => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const token = urlParams.get('token') || undefined;

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
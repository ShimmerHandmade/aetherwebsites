
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import AuthCard from '../components/auth/AuthCard';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthCard>
        {isLogin ? (
          <LoginForm onToggleMode={toggleAuthMode} />
        ) : (
          <SignupForm onToggleMode={toggleAuthMode} />
        )}
      </AuthCard>
    </div>
  );
};

export default Auth;

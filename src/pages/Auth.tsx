
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import AuthCard from '../components/auth/AuthCard';

// Creating simple AuthCard wrapper component since we're not using the imported one
const AuthCardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccessfulSignup = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthCardWrapper>
        {isLogin ? (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <LoginForm 
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
            <SignupForm 
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSuccessfulSignup={handleSuccessfulSignup}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        )}
      </AuthCardWrapper>
    </div>
  );
};

export default Auth;

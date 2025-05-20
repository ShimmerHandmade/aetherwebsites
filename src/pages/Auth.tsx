
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  // Check if user is already logged in, redirect to dashboard if so
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <AuthCard />
    </div>
  );
};

export default Auth;

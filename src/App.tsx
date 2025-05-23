
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Builder from './pages/Builder';
import { supabase } from './integrations/supabase/client';
import './App.css';

// Import existing pages
import OrderManagement from './pages/builder/OrderManagement';
import PageSettings from './pages/builder/PageSettings';
import PaymentSettings from './pages/builder/PaymentSettings';
import ShippingSettings from './pages/builder/ShippingSettings';
import SiteSettings from './pages/builder/SiteSettings';
import Shop from './pages/Shop';
import View from './pages/View';
import PageManager from './pages/builder/PageManager';
import ProductManager from './pages/builder/ProductManager';
import Index from './pages/Index';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/builder/:id" element={session ? <Builder /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/settings" element={session ? <SiteSettings /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/page-settings" element={session ? <PageSettings /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/payment-settings" element={session ? <PaymentSettings /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/shipping-settings" element={session ? <ShippingSettings /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/orders" element={session ? <OrderManagement /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/shop" element={session ? <Shop /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/pages" element={session ? <PageManager /> : <Navigate to="/login" />} />
        <Route path="/builder/:id/products" element={session ? <ProductManager /> : <Navigate to="/login" />} />
        
        {/* Public website view routes */}
        <Route path="/view/:id" element={<View />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Builder from './pages/Builder';
import Shop from './pages/Shop';
import Products from './pages/builder/ProductManager';
import Pages from './pages/builder/PageManager';
import SiteSettings from './pages/builder/SiteSettings';
import PageSettings from './pages/builder/PageSettings';
import PaymentSettings from './pages/builder/PaymentSettings';
import OrderManagement from './pages/builder/OrderManagement';
import ShippingSettings from './pages/builder/ShippingSettings';
import View from './pages/View';
import { Auth } from '@supabase/ui';
import { supabase } from './integrations/supabase/client';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {!session ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/builder/:id/shop" element={<Shop />} />
            <Route path="/builder/:id/products" element={<Products />} />
            <Route path="/builder/:id/pages" element={<Pages />} />
            <Route path="/builder/:id/settings" element={<SiteSettings />} />
            <Route path="/builder/:id/page-settings" element={<PageSettings />} />
            <Route path="/builder/:id/payment-settings" element={<PaymentSettings />} />
            <Route path="/builder/:id/shipping-settings" element={<ShippingSettings />} />
            <Route path="/builder/:id/orders" element={<OrderManagement />} />
            <Route path="/view/:id" element={<View />} />
          </>
        )}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

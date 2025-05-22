
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="*" element={<Auth />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/builder/:id/settings" element={<SiteSettings />} />
            <Route path="/builder/:id/page-settings" element={<PageSettings />} />
            <Route path="/builder/:id/payment-settings" element={<PaymentSettings />} />
            <Route path="/builder/:id/shipping-settings" element={<ShippingSettings />} />
            <Route path="/builder/:id/orders" element={<OrderManagement />} />
          </>
        )}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

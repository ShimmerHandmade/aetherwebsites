
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import BuilderShop from "./pages/builder/Shop";
import BuilderPageSettings from "./pages/builder/PageSettings";
import SimpleProductManager from "./components/builder/SimpleProductManager";
import OrderManager from "./components/builder/OrderManager";
import ShippingSettingsManager from "./components/builder/ShippingSettingsManager";
import PayPalSettings from "./components/PayPalSettings";
import SiteSettings from "./pages/builder/SiteSettings";
import WebsiteViewer from "./pages/WebsiteViewer";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/builder/:id/shop" element={<BuilderShop />} />
            <Route path="/builder/:id/pages" element={<BuilderPageSettings />} />
            <Route path="/builder/:id/products" element={<SimpleProductManager />} />
            <Route path="/builder/:id/orders" element={<OrderManager />} />
            <Route path="/builder/:id/site-settings" element={<SiteSettings />} />
            <Route path="/builder/:id/payment-settings" element={<PayPalSettings websiteId="" />} />
            <Route path="/builder/:id/shipping-settings" element={<ShippingSettingsManager />} />
            <Route path="/view/:id" element={<WebsiteViewer />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

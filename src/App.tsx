import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import PremiumFeatures from "@/pages/PremiumFeatures";
import Builder from "@/pages/Builder";
import BuilderShop from "@/pages/builder/Shop";
import ProductsManager from "@/pages/builder/ProductsManager";
import Website from "@/pages/Website";
import { PlanProvider } from "@/contexts/PlanContext";

const queryClient = new QueryClient();

import DebugInfo from "@/components/DebugInfo";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlanProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/premium-features" element={<PremiumFeatures />} />
              <Route path="/builder/:id" element={<Builder />} />
              <Route path="/builder/:id/shop" element={<BuilderShop />} />
              <Route path="/builder/:id/products" element={<ProductsManager />} />
              <Route path="/view/:id" element={<Website />} />
              <Route path="/site/:id" element={<Website />} />
            </Routes>
            <Toaster />
            <DebugInfo />
          </div>
        </Router>
      </PlanProvider>
    </QueryClientProvider>
  );
}

export default App;

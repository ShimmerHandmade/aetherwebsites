
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
import ProductsManager from "@/pages/builder/Products";
import Orders from "@/pages/builder/Orders";
import ShippingSettings from "@/pages/builder/ShippingSettings";
import SiteSettings from "@/pages/builder/SiteSettings";
import PageSettings from "@/pages/builder/PageSettings";
import BuilderPages from "@/pages/builder/Pages";
import PaymentSettings from "@/pages/builder/PaymentSettings";
import Website from "@/pages/WebsiteViewer";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
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
              <Route path="/builder/:id/orders" element={<Orders />} />
              <Route path="/builder/:id/shipping-settings" element={<ShippingSettings />} />
              <Route path="/builder/:id/site-settings" element={<SiteSettings />} />
              <Route path="/builder/:id/pages" element={<BuilderPages />} />
              <Route path="/builder/:id/payment-settings" element={<PaymentSettings />} />
              <Route path="/view/:id" element={<Website />} />
              <Route path="/view/:id/cart" element={<Website />} />
              <Route path="/view/:id/product/:productId" element={<Website />} />
              <Route path="/view/:id/checkout" element={<Website />} />
              <Route path="/view/:id/order-confirmation" element={<Website />} />
              <Route path="/site/:id" element={<Website />} />
              <Route path="/site/:id/cart" element={<Website />} />
              <Route path="/site/:id/product/:productId" element={<Website />} />
              <Route path="/site/:id/checkout" element={<Website />} />
              <Route path="/site/:id/order-confirmation" element={<Website />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
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

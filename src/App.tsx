
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Builder from "@/pages/Builder";
import WebsiteViewer from "@/pages/WebsiteViewer";
import Shop from "@/pages/builder/Shop";
import Products from "@/pages/builder/Products";
import Pages from "@/pages/builder/Pages";
import PageSettings from "@/pages/builder/PageSettings";
import SiteSettings from "@/pages/builder/SiteSettings";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/view/:id" element={<WebsiteViewer />} />
          <Route path="/builder/:id/shop" element={<Shop />} />
          <Route path="/builder/:id/products" element={<Products />} />
          <Route path="/builder/:id/pages" element={<Pages />} />
          <Route path="/builder/:id/page-settings" element={<PageSettings />} />
          <Route path="/builder/:id/settings" element={<SiteSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

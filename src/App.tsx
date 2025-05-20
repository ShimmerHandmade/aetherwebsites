
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";
import Builder from "@/pages/Builder";
import BuilderShop from "@/pages/builder/Shop";
import BuilderPages from "@/pages/builder/Pages";
import BuilderProducts from "@/pages/builder/Products";
import WebsiteViewer from "@/pages/WebsiteViewer";

// Lazy-loaded components
const Settings = lazy(() => import("@/pages/Profile"));

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/builder/:id" element={<Builder />} />
        <Route path="/builder/:id/shop" element={<BuilderShop />} />
        <Route path="/builder/:id/pages" element={<BuilderPages />} />
        <Route path="/builder/:id/products" element={<BuilderProducts />} />
        <Route path="/site/:id/*" element={<WebsiteViewer />} />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Settings />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </CartProvider>
  );
}

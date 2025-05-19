
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";

// Lazy-loaded components
const Settings = lazy(() => import("@/pages/Profile"));

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
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

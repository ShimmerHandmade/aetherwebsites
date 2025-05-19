
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Builder from "@/pages/builder/Builder";
import BuilderShop from "@/pages/builder/Shop";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme";
import { Suspense, lazy } from "react";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import { CartProvider } from "@/contexts/CartContext";

// Lazy-loaded components
const Settings = lazy(() => import("@/pages/Settings"));

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/builder/:id/products" element={<Builder />} />
            <Route path="/builder/:id/shop" element={<BuilderShop />} />
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
          </Routes>
        </BrowserRouter>
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}

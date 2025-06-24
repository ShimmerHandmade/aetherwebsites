
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Profile from "./pages/Profile";
import WebsiteViewer from "./pages/WebsiteViewer";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetails from "./pages/ProductDetails";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import PremiumFeatures from "./pages/PremiumFeatures";

// Builder sub-pages
import BuilderPages from "./pages/builder/Pages";
import BuilderProducts from "./pages/builder/Products";
import BuilderOrders from "./pages/builder/Orders";
import BuilderOrderManagement from "./pages/builder/OrderManagement";
import BuilderPaymentSettings from "./pages/builder/PaymentSettings";
import BuilderShippingSettings from "./pages/builder/ShippingSettings";
import BuilderSiteSettings from "./pages/builder/SiteSettings";
import BuilderPageSettings from "./pages/builder/PageSettings";
import BuilderShop from "./pages/builder/Shop";
import BuilderThemeEditor from "./pages/builder/ThemeEditor";

import { PlanProvider } from "./contexts/PlanContext";
import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClient>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <PlanProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/builder/:id" element={<Builder />} />
                    <Route path="/builder/:id/pages" element={<BuilderPages />} />
                    <Route path="/builder/:id/theme" element={<BuilderThemeEditor />} />
                    <Route path="/builder/:id/products" element={<BuilderProducts />} />
                    <Route path="/builder/:id/orders" element={<BuilderOrders />} />
                    <Route path="/builder/:id/order-management" element={<BuilderOrderManagement />} />
                    <Route path="/builder/:id/payment" element={<BuilderPaymentSettings />} />
                    <Route path="/builder/:id/shipping" element={<BuilderShippingSettings />} />
                    <Route path="/builder/:id/settings" element={<BuilderSiteSettings />} />
                    <Route path="/builder/:id/page-settings" element={<BuilderPageSettings />} />
                    <Route path="/builder/:id/shop" element={<BuilderShop />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                    <Route path="/premium-features" element={<PremiumFeatures />} />
                    <Route path="/site/:slug" element={<WebsiteViewer />} />
                    <Route path="/site/:slug/*" element={<WebsiteViewer />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </CartProvider>
            </PlanProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </QueryClient>
  );
}

export default App;

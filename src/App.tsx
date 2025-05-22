
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Builder from "@/pages/Builder";
import BuilderProducts from "@/pages/builder/Products";
import BuilderPages from "@/pages/builder/Pages";
import BuilderPageSettings from "@/pages/builder/PageSettings";
import BuilderSiteSettings from "@/pages/builder/SiteSettings";
import OrderManagement from "@/pages/builder/OrderManagement";
import WebsiteViewer from "@/pages/WebsiteViewer";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import PaymentSettings from "@/pages/builder/PaymentSettings";
import PremiumFeatures from "@/pages/PremiumFeatures";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder/:id" element={<Builder />} />
        <Route path="/builder/:id/products" element={<BuilderProducts />} />
        <Route path="/builder/:id/pages" element={<BuilderPages />} />
        <Route path="/builder/:id/page-settings" element={<BuilderPageSettings />} />
        <Route path="/builder/:id/settings" element={<BuilderSiteSettings />} />
        <Route path="/builder/:id/payment-settings" element={<PaymentSettings />} />
        <Route path="/builder/:id/orders" element={<OrderManagement />} />
        <Route path="/site/:id/*" element={<WebsiteViewer />} />
        <Route path="/view/:id/*" element={<WebsiteViewer />} />
        <Route path="/store/:id/cart" element={<Cart />} />
        <Route path="/store/:id/product/:productId" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/premium-features" element={<PremiumFeatures />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;

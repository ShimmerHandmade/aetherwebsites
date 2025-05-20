
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Builder from "@/pages/Builder";
import WebsiteViewer from "@/pages/WebsiteViewer";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder/:id/*" element={<Builder />} />
        <Route path="/view/:id/*" element={<WebsiteViewer />} />
        <Route path="/store/:id/cart" element={<Cart />} />
        <Route path="/store/:id/product/:productId" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;

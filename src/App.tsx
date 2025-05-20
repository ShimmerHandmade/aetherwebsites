
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { PlanProvider } from "@/contexts/PlanContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Builder from "@/pages/Builder";
import WebsiteViewer from "@/pages/WebsiteViewer";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";  // Make sure this is imported

function App() {
  return (
    <BrowserRouter>
      <PlanProvider>
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
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />  {/* Ensure this route exists */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </PlanProvider>
    </BrowserRouter>
  );
}

export default App;

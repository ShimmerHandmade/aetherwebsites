
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const useBuilderNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path.includes('/products')) return "products";
    if (path.includes('/orders')) return "orders";
    if (path.includes('/pages')) return "pages";
    if (path.includes('/payment-settings')) return "payment-settings";
    if (path.includes('/shipping-settings')) return "shipping-settings";
    if (path.includes('/settings')) return "settings";
    return "edit";
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromRoute());
  
  useEffect(() => {
    setActiveTab(getActiveTabFromRoute());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const websiteId = window.location.pathname.split("/")[2];
    if (!websiteId) return;
    
    const routes = {
      edit: `/builder/${websiteId}`,
      products: `/builder/${websiteId}/products`,
      orders: `/builder/${websiteId}/orders`,
      pages: `/builder/${websiteId}/pages`,
      "payment-settings": `/builder/${websiteId}/payment-settings`,
      "shipping-settings": `/builder/${websiteId}/shipping-settings`,
      settings: `/builder/${websiteId}/settings`
    };
    
    const route = routes[value as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  const handleReturnToDashboard = (isSaving: boolean, onReturnToDashboard?: () => void) => {
    if (isSaving) {
      toast("Please wait for the current save to complete", {
        description: "Your changes are being saved"
      });
      return;
    }
    
    if (onReturnToDashboard) {
      onReturnToDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  const handleOpenFullPreview = () => {
    const websiteId = window.location.pathname.split("/")[2];
    if (!websiteId) return;
    
    window.open(`/site/${websiteId}`, '_blank');
  };

  return {
    activeTab,
    handleTabChange,
    handleReturnToDashboard,
    handleOpenFullPreview
  };
};

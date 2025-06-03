
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "@/hooks/useCart";

interface CartButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  siteCartUrl?: string; // New prop for site-specific cart URL
}

const CartButton: React.FC<CartButtonProps> = ({ 
  variant = "outline",
  size = "icon",
  className = "",
  siteCartUrl
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const handleClick = () => {
    if (siteCartUrl) {
      // For site-specific cart URLs, navigate directly
      navigate(siteCartUrl);
    } else {
      // Try to detect if we're in a site context from the current URL
      const currentPath = location.pathname;
      if (currentPath.includes('/site/')) {
        // Extract site ID and navigate to site-specific cart
        const siteIdMatch = currentPath.match(/\/site\/([^\/]+)/);
        if (siteIdMatch) {
          const siteId = siteIdMatch[1];
          navigate(`/site/${siteId}/cart`);
          return;
        }
      }
      if (currentPath.includes('/view/')) {
        // Extract site ID and navigate to site-specific cart
        const siteIdMatch = currentPath.match(/\/view\/([^\/]+)/);
        if (siteIdMatch) {
          const siteId = siteIdMatch[1];
          navigate(`/view/${siteId}/cart`);
          return;
        }
      }
      
      // For regular cart navigation within the main app
      navigate('/cart');
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      className={`relative ${className}`}
    >
      <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartButton;


import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/hooks/useCart";

interface CartButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ 
  variant = "outline",
  size = "icon",
  className = ""
}) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={() => navigate('/cart')}
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

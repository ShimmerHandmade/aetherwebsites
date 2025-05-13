
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: {
    product: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
    };
    quantity: number;
  };
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const increaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="p-4 flex items-center">
      {/* Product image */}
      <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="h-full w-full object-contain" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="ml-4 flex-grow">
        <Link to={`/product/${product.id}`} className="font-medium text-gray-900 hover:text-blue-600">
          {product.name}
        </Link>
        <div className="text-gray-500 text-sm mt-1">
          ${product.price.toFixed(2)} each
        </div>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center border rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none" 
          onClick={decreaseQuantity}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-10 text-center">{quantity}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none" 
          onClick={increaseQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Price */}
      <div className="ml-6 text-right min-w-[80px]">
        <div className="font-medium">${(product.price * quantity).toFixed(2)}</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 mt-1" 
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

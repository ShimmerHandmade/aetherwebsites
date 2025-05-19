
import React from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };
  
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    // Optionally, you can check against available stock
    if (product.stock === null || newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(product.id);
  };
  
  const itemTotal = product.price * quantity;
  
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <Package className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-1">{product.category || 'Uncategorized'}</p>
          <p className="text-sm text-gray-900">${product.price.toFixed(2)} each</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={decreaseQuantity} 
              className="h-8 w-8 rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-center w-8">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={increaseQuantity} 
              className="h-8 w-8 rounded-none"
              disabled={product.stock !== null && quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="font-medium">${itemTotal.toFixed(2)}</p>
            <button 
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 text-xs flex items-center mt-1"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

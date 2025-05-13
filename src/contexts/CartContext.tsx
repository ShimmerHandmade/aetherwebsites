
import React, { createContext, useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // If there's an error parsing, just start with an empty cart
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      // Check if product already exists in cart
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if product exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item if product doesn't exist in cart
        return [...currentItems, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
    toast.success('Item removed from cart');
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';

export interface CartItem {
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

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);
  
  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Add item to cart
  const addToCart = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product already exists in cart, increase quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Otherwise add new item to cart
        return [...currentItems, { product, quantity }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };
  
  // Update quantity of an item
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(currentItems => {
      return currentItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };
  
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

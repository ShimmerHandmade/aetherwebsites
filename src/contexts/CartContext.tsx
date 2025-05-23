
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  
  // Additional properties needed by Cart.tsx
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// Export the CartContext directly so it can be imported
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate total and item count
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setCartTotal(total);
    
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(items);
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // If item exists, update quantity
        const newQuantity = existingItem.quantity + quantity;
        toast.success(`Updated quantity of ${product.name} to ${newQuantity}`);
        
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Add new item
        toast.success(`Added ${product.name} to cart`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevCart.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };
  
  // Calculate derived values
  const subtotal = cartTotal;
  const totalItems = itemCount;
  const items = cart;

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      itemCount,
      // Additional properties needed by Cart.tsx
      items,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

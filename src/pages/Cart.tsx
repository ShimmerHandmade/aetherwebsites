
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/CartItem";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  siteName?: string;
  siteId?: string;
}

const Cart: React.FC<CartProps> = ({ siteName, siteId }) => {
  const { items, clearCart, totalItems, subtotal } = useCart();
  const navigate = useNavigate();
  
  // Determine if this is a site-specific cart (viewed in WebsiteViewer)
  const isSiteSpecificCart = !!siteId;

  // Handle navigation back
  const handleBackNavigation = () => {
    if (isSiteSpecificCart) {
      // Go back to the site home
      window.location.href = `/site/${siteId}`;
    } else {
      // Go to main app home
      navigate('/');
    }
  };

  // Get display name - either from prop or default
  const displayName = siteName || "ModernBuilder Store";

  return (
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <Button 
              variant="ghost" 
              onClick={handleBackNavigation}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Looks like you haven't added any products to your cart yet.</p>
            <Button onClick={handleBackNavigation}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Cart Items ({totalItems})</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
                
                <div className="p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBackNavigation}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-4">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">Calculated at checkout</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Discount code" 
                        className="h-9"
                      />
                      <Button variant="outline" size="sm">Apply</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Shipping, taxes, and discounts calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} {displayName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWebsite } from '@/hooks/useWebsite';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CreditCard, MapPin, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { id: websiteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { website } = useWebsite(websiteId);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const [billingDetails, setBillingDetails] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to cash on delivery
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);

  useEffect(() => {
    if (!websiteId) {
      console.error("Website ID is missing");
      return;
    }
  }, [websiteId]);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingSettings = async () => {
      if (websiteId && cart.items.length > 0) {
        setLoadingShipping(true);
        try {
          // Calculate total weight
          const totalWeight = cart.items.reduce((total, item) => {
            return total + ((item.product.weight || 0) * item.quantity);
          }, 0);
          
          // Fetch shipping settings
          const { data: settings, error } = await supabase
            .from("shipping_settings")
            .select("*")
            .eq("website_id", websiteId)
            .single();
            
          if (error) {
            console.error("Error fetching shipping settings:", error);
          } else if (settings) {
            const availableMethods = [];
            let defaultMethod = null;
            
            // Check if order qualifies for free shipping
            const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            if (settings.free_shipping_enabled && subtotal >= settings.free_shipping_minimum) {
              availableMethods.push({
                id: 'free',
                name: 'Free Shipping',
                description: 'Your order qualifies for free shipping!',
                cost: 0
              });
              defaultMethod = 'free';
            }
            
            // Add flat rate if enabled
            if (settings.flat_rate_enabled) {
              availableMethods.push({
                id: 'flat_rate',
                name: 'Standard Shipping',
                description: `Flat rate shipping: $${settings.flat_rate_amount.toFixed(2)}`,
                cost: settings.flat_rate_amount
              });
              if (!defaultMethod) defaultMethod = 'flat_rate';
            }
            
            // Add weight-based rates if enabled
            if (settings.weight_based_enabled && settings.weight_based_rates && settings.weight_based_rates.length > 0) {
              // Find applicable weight rate
              const applicableRate = settings.weight_based_rates.find(
                rate => totalWeight >= rate.min_weight && totalWeight <= rate.max_weight
              );
              
              if (applicableRate) {
                availableMethods.push({
                  id: 'weight_based',
                  name: 'Weight-Based Shipping',
                  description: `Based on package weight (${totalWeight.toFixed(1)} lbs): $${applicableRate.rate.toFixed(2)}`,
                  cost: applicableRate.rate
                });
                if (!defaultMethod && availableMethods.length === 1) defaultMethod = 'weight_based';
              }
            }
            
            // Set available methods
            setShippingMethods(availableMethods);
            
            // Set default method if available
            if (defaultMethod && availableMethods.length > 0) {
              const method = availableMethods.find(m => m.id === defaultMethod);
              setSelectedShippingMethod(method);
              setShippingCost(method.cost);
            }
          }
        } catch (err) {
          console.error("Error processing shipping methods:", err);
        } finally {
          setLoadingShipping(false);
        }
      }
    };
    
    fetchShippingSettings();
  }, [websiteId, cart.items]);
  
  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const handleShippingForBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseShippingForBilling(e.target.checked);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    setter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderRequest = {
        items: cart.items,
        websiteId: websiteId,
        customerInfo: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        shippingAddress: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.zip,
          country: shippingDetails.country || "US"
        },
        billingAddress: useShippingForBilling ? {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.zip,
          country: shippingDetails.country || "US"
        } : {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          street: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          postalCode: billingDetails.zip,
          country: billingDetails.country || "US"
        },
        paymentMethod: paymentMethod,
        shippingMethod: selectedShippingMethod?.id || 'flat_rate',
        notes: orderNotes
      };
      
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Order created successfully!");
        clearCart();
        
        if (paymentMethod === "stripe" && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          navigate(`/site/${websiteId}/order-confirmation?order_id=${data.order.id}&status=success`);
        }
      } else {
        toast.error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost;
  
  return (
    <div className="container mx-auto mt-10">
      <div className="flex shadow-md my-10">
        <div className="w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Checkout</h1>
          </div>
          
          {/* Customer Information Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={(e) => handleInputChange(e, setCustomerInfo)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={(e) => handleInputChange(e, setCustomerInfo)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange(e, setCustomerInfo)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange(e, setCustomerInfo)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          {/* Shipping Details Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Shipping Details</h2>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                type="text" 
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={(e) => handleInputChange(e, setShippingDetails)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  type="text" 
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={(e) => handleInputChange(e, setShippingDetails)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  type="text" 
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={(e) => handleInputChange(e, setShippingDetails)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input 
                  type="text" 
                  id="zip"
                  name="zip"
                  value={shippingDetails.zip}
                  onChange={(e) => handleInputChange(e, setShippingDetails)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input 
                type="text" 
                id="country"
                name="country"
                value={shippingDetails.country}
                onChange={(e) => handleInputChange(e, setShippingDetails)}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Billing Details Section */}
          <div className="mt-8">
            <div className="flex items-center">
              <Checkbox 
                id="useShippingForBilling"
                checked={useShippingForBilling}
                onCheckedChange={handleShippingForBillingChange}
              />
              <Label htmlFor="useShippingForBilling" className="ml-2">Use shipping address for billing</Label>
            </div>
            
            {!useShippingForBilling && (
              <div className="mt-4">
                <h2 className="text-lg font-medium mb-4">Billing Details</h2>
                <div>
                  <Label htmlFor="billingAddress">Address</Label>
                  <Input 
                    type="text" 
                    id="billingAddress"
                    name="address"
                    value={billingDetails.address}
                    onChange={(e) => handleInputChange(e, setBillingDetails)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input 
                      type="text" 
                      id="billingCity"
                      name="city"
                      value={billingDetails.city}
                      onChange={(e) => handleInputChange(e, setBillingDetails)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input 
                      type="text" 
                      id="billingState"
                      name="state"
                      value={billingDetails.state}
                      onChange={(e) => handleInputChange(e, setBillingDetails)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingZip">Zip Code</Label>
                    <Input 
                      type="text" 
                      id="billingZip"
                      name="zip"
                      value={billingDetails.zip}
                      onChange={(e) => handleInputChange(e, setBillingDetails)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    type="text" 
                    id="country"
                    name="country"
                    value={billingDetails.country}
                    onChange={(e) => handleInputChange(e, setBillingDetails)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Method Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  className="mr-2"
                  checked={paymentMethod === "cod"}
                  onChange={() => handlePaymentMethodChange("cod")}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
              
              {website?.settings?.stripeEnabled && (
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="stripe"
                    className="mr-2"
                    checked={paymentMethod === "stripe"}
                    onChange={() => handlePaymentMethodChange("stripe")}
                  />
                  <label htmlFor="stripe">Stripe</label>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Notes Section */}
          <div className="mt-8">
            <Label htmlFor="orderNotes">Order Notes</Label>
            <Input
              id="orderNotes"
              name="orderNotes"
              placeholder="Notes about your order, e.g. special notes for delivery"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Order Summary Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-medium border-b pb-3">Order Summary</h3>
            
            {/* Order Items Summary */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{item.quantity} ×</span>
                    <span>{item.product.name}</span>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Shipping Method Selection */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Shipping Method</h4>
              {loadingShipping ? (
                <div className="flex items-center justify-center py-3">
                  <div className="w-5 h-5 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading shipping options...</span>
                </div>
              ) : shippingMethods.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No shipping methods available</div>
              ) : (
                <div className="space-y-2">
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`shipping-${method.id}`}
                        name="shippingMethod"
                        className="mr-2"
                        checked={selectedShippingMethod?.id === method.id}
                        onChange={() => {
                          setSelectedShippingMethod(method);
                          setShippingCost(method.cost);
                        }}
                      />
                      <label htmlFor={`shipping-${method.id}`} className="flex flex-col">
                        <span className="font-medium text-sm">{method.name}</span>
                        <span className="text-xs text-gray-500">{method.description}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Buttons */}
            <Button 
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

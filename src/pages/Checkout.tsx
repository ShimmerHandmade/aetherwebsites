import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useShippingCalculator } from '@/hooks/useShippingCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Truck, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState<any>(null);
  const [hasStripeEnabled, setHasStripeEnabled] = useState(false);
  
  // Get website ID from site settings
  const websiteId = window.__SITE_SETTINGS__?.siteId || '';
  const { shippingSettings, calculateShipping } = useShippingCalculator(websiteId);
  
  // Calculate total weight of items
  const totalWeight = items.reduce((sum, item) => {
    return sum + ((item.product.weight || 0) * item.quantity);
  }, 0);
  
  // Calculate shipping cost
  const shippingCalculation = calculateShipping(subtotal, totalWeight);
  const shippingCost = shippingCalculation.cost;
  const totalWithShipping = subtotal + shippingCost;
  
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get website ID and check if it has Stripe enabled
  useEffect(() => {
    const siteId = window.__SITE_SETTINGS__?.siteId;
    if (!siteId) {
      console.error("Could not determine website ID");
      return;
    }
    
    const fetchWebsiteInfo = async () => {
      try {
        // Get website information
        const { data: website, error: websiteError } = await supabase
          .from('websites')
          .select('id, name, settings')
          .eq('id', siteId)
          .single();
        
        if (websiteError) {
          console.error("Error fetching website:", websiteError);
          return;
        }
        
        setWebsiteInfo(website);
        
        // Check if this website has Stripe Connect set up
        // Use explicit typing with 'any' to avoid type checking for tables not in the schema
        const { data: stripeAccount, error: stripeError } = await supabase
          .from('stripe_connect_accounts' as any)
          .select('onboarding_complete, charges_enabled')
          .eq('website_id', siteId)
          .eq('onboarding_complete', true)
          .eq('charges_enabled', true)
          .maybeSingle();
        
        if (stripeError) {
          console.error("Error checking Stripe status:", stripeError);
          return;
        }
        
        // If a valid Stripe Connect account exists, enable Stripe payment option
        if (stripeAccount) {
          console.log("Stripe Connect account is active, enabling online payments");
          setHasStripeEnabled(true);
          setPaymentMethod('stripe'); // Default to Stripe if available
        } else {
          console.log("No active Stripe Connect account found, using COD only");
        }
      } catch (error) {
        console.error("Error fetching website info:", error);
      }
    };
    
    fetchWebsiteInfo();
  }, []);

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[`shipping_${name}`]) {
      setErrors(prev => ({ ...prev, [`shipping_${name}`]: '' }));
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[`billing_${name}`]) {
      setErrors(prev => ({ ...prev, [`billing_${name}`]: '' }));
    }
  };

  const toggleSameAsBilling = () => {
    setSameAsBilling(!sameAsBilling);
    if (!sameAsBilling) {
      setBillingAddress({ ...shippingAddress });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate customer info
    if (!customerInfo.email) newErrors.email = 'Email is required';
    if (!customerInfo.name) newErrors.name = 'Name is required';
    
    // Validate shipping address
    if (!shippingAddress.street) newErrors.shipping_street = 'Street address is required';
    if (!shippingAddress.city) newErrors.shipping_city = 'City is required';
    if (!shippingAddress.state) newErrors.shipping_state = 'State is required';
    if (!shippingAddress.postalCode) newErrors.shipping_postalCode = 'Postal code is required';
    
    // Validate billing address if different
    if (!sameAsBilling) {
      if (!billingAddress.street) newErrors.billing_street = 'Street address is required';
      if (!billingAddress.city) newErrors.billing_city = 'City is required';
      if (!billingAddress.state) newErrors.billing_state = 'State is required';
      if (!billingAddress.postalCode) newErrors.billing_postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Get the website ID from the URL or site settings
      const websiteId = window.__SITE_SETTINGS__?.siteId || '';
      if (!websiteId) {
        toast.error('Could not determine website ID');
        return;
      }

      console.log("Processing order for website:", websiteId, "with payment method:", paymentMethod);

      // Create the order request
      const orderData = {
        items,
        websiteId,
        customerInfo,
        shippingAddress,
        billingAddress: sameAsBilling ? shippingAddress : billingAddress,
        paymentMethod,
        notes,
        shippingMethod: shippingCalculation.method,
        shippingCost: shippingCost
      };

      // Call the create-order function
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        // Clear the cart
        clearCart();
        
        // If this is a Stripe payment, redirect to the Stripe checkout
        if (paymentMethod === 'stripe' && data.checkout_url) {
          console.log("Redirecting to Stripe checkout:", data.checkout_url);
          
          // Open Stripe checkout in a new tab
          window.open(data.checkout_url, '_blank');
          
          // Navigate to order confirmation page
          navigate('/order-confirmation', { 
            state: { 
              orderId: data.order.id,
              orderTotal: data.order.total,
              orderStatus: data.order.status,
              isStripePayment: true
            } 
          });
        } else {
          // For COD, just go to order confirmation
          console.log("Cash on delivery order placed successfully");
          navigate('/order-confirmation', { 
            state: { 
              orderId: data.order.id,
              orderTotal: data.order.total,
              orderStatus: data.order.status
            } 
          });
        }
        
        toast.success('Order placed successfully!');
      } else {
        throw new Error(data?.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">You don't have any items in your cart to checkout.</p>
            <Button onClick={() => navigate(-1)}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info and Shipping Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={customerInfo.name} 
                    onChange={handleCustomerInfoChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={customerInfo.email} 
                    onChange={handleCustomerInfoChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={customerInfo.phone} 
                    onChange={handleCustomerInfoChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <Truck className="h-5 w-5 text-gray-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shipping_street">Street Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="shipping_street" 
                    name="street" 
                    value={shippingAddress.street} 
                    onChange={handleShippingChange}
                    className={errors.shipping_street ? "border-red-500" : ""}
                  />
                  {errors.shipping_street && <p className="text-red-500 text-sm mt-1">{errors.shipping_street}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">City <span className="text-red-500">*</span></Label>
                    <Input 
                      id="shipping_city" 
                      name="city" 
                      value={shippingAddress.city} 
                      onChange={handleShippingChange}
                      className={errors.shipping_city ? "border-red-500" : ""}
                    />
                    {errors.shipping_city && <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="shipping_state">State <span className="text-red-500">*</span></Label>
                    <Input 
                      id="shipping_state" 
                      name="state" 
                      value={shippingAddress.state} 
                      onChange={handleShippingChange}
                      className={errors.shipping_state ? "border-red-500" : ""}
                    />
                    {errors.shipping_state && <p className="text-red-500 text-sm mt-1">{errors.shipping_state}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_postalCode">Postal Code <span className="text-red-500">*</span></Label>
                    <Input 
                      id="shipping_postalCode" 
                      name="postalCode" 
                      value={shippingAddress.postalCode} 
                      onChange={handleShippingChange}
                      className={errors.shipping_postalCode ? "border-red-500" : ""}
                    />
                    {errors.shipping_postalCode && <p className="text-red-500 text-sm mt-1">{errors.shipping_postalCode}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="shipping_country">Country</Label>
                    <Input 
                      id="shipping_country" 
                      name="country" 
                      value={shippingAddress.country} 
                      onChange={handleShippingChange}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Billing Address</h2>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="sameAsBilling" 
                    checked={sameAsBilling} 
                    onChange={toggleSameAsBilling}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <Label htmlFor="sameAsBilling">Same as shipping address</Label>
                </div>
              </div>
              
              {!sameAsBilling && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billing_street">Street Address <span className="text-red-500">*</span></Label>
                    <Input 
                      id="billing_street" 
                      name="street" 
                      value={billingAddress.street} 
                      onChange={handleBillingChange}
                      className={errors.billing_street ? "border-red-500" : ""}
                    />
                    {errors.billing_street && <p className="text-red-500 text-sm mt-1">{errors.billing_street}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_city">City <span className="text-red-500">*</span></Label>
                      <Input 
                        id="billing_city" 
                        name="city" 
                        value={billingAddress.city} 
                        onChange={handleBillingChange}
                        className={errors.billing_city ? "border-red-500" : ""}
                      />
                      {errors.billing_city && <p className="text-red-500 text-sm mt-1">{errors.billing_city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="billing_state">State <span className="text-red-500">*</span></Label>
                      <Input 
                        id="billing_state" 
                        name="state" 
                        value={billingAddress.state} 
                        onChange={handleBillingChange}
                        className={errors.billing_state ? "border-red-500" : ""}
                      />
                      {errors.billing_state && <p className="text-red-500 text-sm mt-1">{errors.billing_state}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_postalCode">Postal Code <span className="text-red-500">*</span></Label>
                      <Input 
                        id="billing_postalCode" 
                        name="postalCode" 
                        value={billingAddress.postalCode} 
                        onChange={handleBillingChange}
                        className={errors.billing_postalCode ? "border-red-500" : ""}
                      />
                      {errors.billing_postalCode && <p className="text-red-500 text-sm mt-1">{errors.billing_postalCode}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="billing_country">Country</Label>
                      <Input 
                        id="billing_country" 
                        name="country" 
                        value={billingAddress.country} 
                        onChange={handleBillingChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <CreditCard className="h-5 w-5 text-gray-500" />
              </div>
              
              <RadioGroup 
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                {hasStripeEnabled && (
                  <div className="flex items-center space-x-2 p-3 border rounded-md mb-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="cursor-pointer flex-1">
                      <div className="font-medium">Credit Card</div>
                      <div className="text-sm text-gray-500">Pay securely with your credit or debit card</div>
                    </Label>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 p-3 border rounded-md mb-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer flex-1">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive your order</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Order Notes */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea 
                  id="notes" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information about your order..."
                  className="h-24"
                />
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Products list */}
              <div className="border rounded-md mb-4 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.product.weight && (
                        <p className="text-xs text-gray-400">Weight: {item.product.weight} lbs each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <div className="text-right">
                    {shippingCalculation.isFree ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span>${shippingCost.toFixed(2)}</span>
                    )}
                    <div className="text-xs text-gray-500">{shippingCalculation.method}</div>
                  </div>
                </div>
                
                {totalWeight > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total Weight</span>
                    <span>{totalWeight.toFixed(1)} lbs</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalWithShipping.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? 'Processing...' : (paymentMethod === 'stripe' ? 'Pay with Card' : 'Place Order')}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

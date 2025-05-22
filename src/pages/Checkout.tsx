
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface WeightBasedRate {
  min: number;
  max: number;
  rate: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { id: siteId } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    sameAsBilling: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  
  useEffect(() => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      navigate('/cart');
      return;
    }
    
    if (!siteId) {
      console.error("No site ID found in URL");
      navigate('/');
      return;
    }
    
    // Calculate total weight of cart items
    let weight = 0;
    cart.forEach(item => {
      if (item.product && item.quantity && item.product.weight) {
        weight += item.product.weight * item.quantity;
      }
    });
    
    setTotalWeight(weight);
    
    // Fetch shipping options from the database
    const fetchShippingSettings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('shipping_settings')
          .select('*')
          .eq('website_id', siteId)
          .single();
        
        if (error) {
          console.error("Error fetching shipping settings:", error);
          // Set default shipping method
          setShippingMethods([{
            id: 'standard',
            name: 'Standard Shipping',
            price: 5.99,
            description: '3-5 business days'
          }]);
          setSelectedShippingMethod('standard');
          setShippingCost(5.99);
          return;
        }
        
        // Prepare shipping methods based on settings
        const methods: ShippingMethod[] = [];
        
        // Add flat rate if enabled
        if (data.flat_rate_enabled) {
          methods.push({
            id: 'flat',
            name: 'Flat Rate Shipping',
            price: data.flat_rate_amount || 0,
            description: 'Fixed shipping rate'
          });
        }
        
        // Add weight-based rates if enabled
        if (data.weight_based_enabled && data.weight_based_rates) {
          let weightRates: WeightBasedRate[] = [];
          
          // Parse weight rates from data
          if (typeof data.weight_based_rates === 'string') {
            try {
              weightRates = JSON.parse(data.weight_based_rates);
            } catch (e) {
              console.error("Error parsing weight rates:", e);
            }
          } else if (Array.isArray(data.weight_based_rates)) {
            weightRates = data.weight_based_rates as unknown as WeightBasedRate[];
          }
          
          // Find applicable weight rate
          const applicableRate = weightRates.find(rate => 
            weight >= rate.min && weight <= rate.max
          );
          
          if (applicableRate) {
            methods.push({
              id: 'weight',
              name: 'Weight-Based Shipping',
              price: applicableRate.rate,
              description: `Based on package weight (${weight.toFixed(2)} lbs)`
            });
          }
        }
        
        // Add free shipping if enabled and applicable
        if (data.free_shipping_enabled) {
          const cartSubtotal = cart.reduce((total, item) => {
            return total + (item.product?.price || 0) * (item.quantity || 1);
          }, 0);
          
          if (cartSubtotal >= data.free_shipping_minimum) {
            methods.push({
              id: 'free',
              name: 'Free Shipping',
              price: 0,
              description: 'Your order qualifies for free shipping!'
            });
          }
        }
        
        // If no methods are available, add default
        if (methods.length === 0) {
          methods.push({
            id: 'standard',
            name: 'Standard Shipping',
            price: 5.99,
            description: '3-5 business days'
          });
        }
        
        setShippingMethods(methods);
        
        // Select the cheapest option by default
        const cheapestMethod = methods.reduce((prev, current) => 
          prev.price < current.price ? prev : current
        );
        
        setSelectedShippingMethod(cheapestMethod.id);
        setShippingCost(cheapestMethod.price);
        
      } catch (error) {
        console.error("Error in fetchShippingSettings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShippingSettings();
  }, [cart, navigate, siteId]);
  
  const handleShippingMethodChange = (value: string) => {
    setSelectedShippingMethod(value);
    const method = shippingMethods.find(m => m.id === value);
    if (method) {
      setShippingCost(method.price);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsBilling: checked,
      // Copy shipping address to billing if checked
      billingAddress: checked ? prev.address : prev.billingAddress,
      billingCity: checked ? prev.city : prev.billingCity,
      billingState: checked ? prev.state : prev.billingState,
      billingZip: checked ? prev.zip : prev.billingZip,
      billingCountry: checked ? prev.country : prev.billingCountry,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Basic validation
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || 
          !formData.city || !formData.state || !formData.zip || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if (!selectedShippingMethod) {
        toast.error("Please select a shipping method");
        return;
      }
      
      // Payment validation (simplified for demo)
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error("Please enter valid payment information");
        return;
      }
      
      // Create order data
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone,
      };
      
      const billingAddress = formData.sameAsBilling ? shippingAddress : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        zip: formData.billingZip,
        country: formData.billingCountry,
      };
      
      const paymentInfo = {
        last4: formData.cardNumber.slice(-4),
        brand: detectCardBrand(formData.cardNumber),
      };
      
      const selectedMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
      
      const orderData = {
        website_id: siteId,
        customer_email: formData.email,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_method: selectedMethod?.name || 'Standard Shipping',
        shipping_cost: shippingCost,
        payment_info: paymentInfo,
        status: 'processing',
        total_amount: cartTotal + shippingCost,
      };
      
      // Process payment (mock)
      const paymentProcessed = await mockProcessPayment();
      
      if (!paymentProcessed) {
        toast.error("Payment processing failed. Please try again.");
        return;
      }
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      
      if (!orderData?.id) {
        throw new Error("Failed to create order");
      }
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image_url: item.product.image_url,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart and redirect to order confirmation
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${orderData.id}`);
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Mock payment processing
  const mockProcessPayment = async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() < 0.95;
        resolve(success);
      }, 1500);
    });
  };
  
  // Helper function to detect card brand
  const detectCardBrand = (cardNumber: string): string => {
    // Basic card brand detection
    if (/^4/.test(cardNumber)) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    return 'Unknown';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading checkout...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Customer info and shipping */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input 
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Billing Address</h2>
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sameAsBilling" 
                      checked={formData.sameAsBilling} 
                      onCheckedChange={handleCheckboxChange} 
                    />
                    <Label htmlFor="sameAsBilling" className="text-sm font-medium">
                      Same as shipping address
                    </Label>
                  </div>
                </div>
                
                {!formData.sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="billingAddress">Address</Label>
                      <Input 
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        required={!formData.sameAsBilling}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingCity">City</Label>
                      <Input 
                        id="billingCity"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        required={!formData.sameAsBilling}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input 
                          id="billingState"
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleInputChange}
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZip">ZIP Code</Label>
                        <Input 
                          id="billingZip"
                          name="billingZip"
                          value={formData.billingZip}
                          onChange={handleInputChange}
                          required={!formData.sameAsBilling}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Shipping Method</h2>
                {shippingMethods.length > 0 ? (
                  <RadioGroup 
                    value={selectedShippingMethod} 
                    onValueChange={handleShippingMethodChange}
                  >
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <div 
                          key={method.id}
                          className="flex items-center justify-between border rounded-md p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div>
                              <Label htmlFor={method.id} className="font-medium">{method.name}</Label>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                          <span className="font-medium">
                            {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <p>No shipping methods available.</p>
                )}
              </Card>
              
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456" 
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiration Date</Label>
                      <Input 
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY" 
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">Security Code</Label>
                      <Input 
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="CVC" 
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right column - Order summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="font-semibold text-xl mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  {cart && Array.isArray(cart) && cart.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex">
                        <span className="font-medium">{item.quantity} × </span>
                        <span className="ml-2">{item.product.name}</span>
                      </div>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(cartTotal + shippingCost).toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Complete Order
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

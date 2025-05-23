
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

// Define missing cart properties in CartContextType
interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  sameAsBilling: boolean;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardholderName: string;
}

// Mock shipping methods
const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 5.99, description: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 14.99, description: '1-2 business days' },
  { id: 'overnight', name: 'Overnight Shipping', price: 24.99, description: 'Next business day' }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart = [], clearCart, cartTotal = 0 } = useCart();
  const { id: siteId } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    sameAsBilling: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardholderName: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('standard');
  const [shippingCost, setShippingCost] = useState(5.99);
  
  // Set shipping cost based on selected method
  useEffect(() => {
    const method = shippingMethods.find(m => m.id === selectedShippingMethod);
    if (method) {
      setShippingCost(method.price);
    }
  }, [selectedShippingMethod]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      navigate('/');
    }
  }, [cart, navigate]);
  
  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, sameAsBilling: checked }));
  };
  
  const handleShippingMethodChange = (value: string) => {
    setSelectedShippingMethod(value);
  };
  
  // Mock payment processing
  const mockProcessPayment = () => {
    return new Promise<boolean>((resolve) => {
      // In a real app, this would make a request to Stripe or another payment processor
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        resolve(success);
      }, 1500);
    });
  };
  
  // Helper function to determine card brand
  const detectCardBrand = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'visa';
    if (cardNumber.startsWith('5')) return 'mastercard';
    if (cardNumber.startsWith('3')) return 'amex';
    if (cardNumber.startsWith('6')) return 'discover';
    return 'unknown';
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
      
      // Process payment (mock)
      const paymentProcessed = await mockProcessPayment();
      
      if (!paymentProcessed) {
        toast.error("Payment processing failed. Please try again.");
        return;
      }
      
      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          website_id: siteId,
          customer_email: formData.email,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          shipping_method: selectedMethod?.name || 'Standard Shipping',
          shipping_cost: shippingCost,
          payment_info: paymentInfo,
          status: 'processing',
          total_amount: cartTotal + shippingCost,
        })
        .select();
      
      if (error) throw error;
      
      // Make sure we have order data
      if (!data || data.length === 0) {
        throw new Error("Failed to create order");
      }
      
      // Extract the order ID for order items
      const createdOrderId = data[0].id;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: createdOrderId,
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
      navigate(`/order-confirmation/${createdOrderId}`);
      
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!cart) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 space-y-8">
              {/* Customer Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
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
              
              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
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
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input 
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>
              
              {/* Billing Address */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Checkbox 
                    id="sameAsBilling"
                    checked={formData.sameAsBilling}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="sameAsBilling" className="ml-2">
                    Billing address is same as shipping address
                  </Label>
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
                    <div>
                      <Label htmlFor="billingState">State/Province</Label>
                      <Input 
                        id="billingState"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        required={!formData.sameAsBilling}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZip">ZIP/Postal Code</Label>
                      <Input 
                        id="billingZip"
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleInputChange}
                        required={!formData.sameAsBilling}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingCountry">Country</Label>
                      <Input 
                        id="billingCountry"
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        required={!formData.sameAsBilling}
                      />
                    </div>
                  </div>
                )}
              </Card>
              
              {/* Shipping Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <RadioGroup 
                  value={selectedShippingMethod} 
                  onValueChange={handleShippingMethodChange}
                  className="space-y-4"
                >
                  {shippingMethods.map(method => (
                    <div 
                      key={method.id} 
                      className={`flex items-center justify-between border p-4 rounded-md ${selectedShippingMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value={method.id} id={`shipping-${method.id}`} />
                        <Label htmlFor={`shipping-${method.id}`} className="ml-2">
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </Label>
                      </div>
                      <div className="font-medium">${method.price.toFixed(2)}</div>
                    </div>
                  ))}
                </RadioGroup>
              </Card>
              
              {/* Payment */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input 
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiration Date</Label>
                      <Input 
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input 
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="w-full md:w-1/3">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3 text-gray-600">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {item.product.description?.substring(0, 30)}
                            {item.product.description && item.product.description.length > 30 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(cartTotal + shippingCost).toFixed(2)}</span>
                  </div>
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
                    'Place Order'
                  )}
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;


import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag, AlertCircle, CreditCard, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OrderConfirmation = () => {
  const { id: siteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract order ID from URL params or state
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_name,
              product_image_url,
              quantity,
              price_at_purchase
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrderData(order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleBackToSite = () => {
    if (siteId) {
      const currentPath = location.pathname;
      if (currentPath.includes('/view/')) {
        navigate(`/view/${siteId}`);
      } else {
        navigate(`/site/${siteId}`);
      }
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!orderId || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="rounded-full bg-yellow-100 p-3 w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for. Please check your email for order confirmation details.
          </p>
          <Button onClick={handleBackToSite}>Return to Store</Button>
        </div>
      </div>
    );
  }

  const isStripePayment = orderData.payment_info?.method === 'stripe';
  const isSuccessful = status === 'success' || orderData.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className={`rounded-full p-4 w-fit mx-auto mb-4 ${
            isSuccessful ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {isSuccessful ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <CreditCard className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isSuccessful ? 'Order Confirmed!' : 'Order Received!'}
          </h1>
          <p className="text-gray-600">
            {isSuccessful 
              ? 'Thank you for your purchase. Your order has been confirmed.' 
              : isStripePayment 
                ? 'Your order has been received and payment is being processed.'
                : 'Your order has been received and will be processed shortly.'}
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Order Details */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">#{orderData.id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-medium capitalize">{orderData.status?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(orderData.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">${orderData.total_amount?.toFixed(2)}</p>
              </div>
            </div>
            
            {orderData.payment_info?.method && (
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">
                  {orderData.payment_info.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                </p>
              </div>
            )}
          </div>

          {/* Order Items */}
          {orderData.order_items && orderData.order_items.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {orderData.order_items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      {item.product_image_url && (
                        <img 
                          src={item.product_image_url} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.product_name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${orderData.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
              <li>You will receive an order confirmation email shortly</li>
              <li>Your order will be processed and prepared for shipment</li>
              <li>You'll receive tracking information once your order ships</li>
              <li>Your items will be delivered according to the shipping method selected</li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
            <Button onClick={handleBackToSite} className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;


import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag, AlertCircle, CreditCard } from "lucide-react";

interface OrderConfirmationState {
  orderId?: string;
  orderTotal?: number;
  orderStatus?: string;
  isStripePayment?: boolean;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState | null;
  
  const orderId = state?.orderId;
  const orderTotal = state?.orderTotal;
  const orderStatus = state?.orderStatus;
  const isStripePayment = state?.isStripePayment || false;

  useEffect(() => {
    // If the page is accessed directly without order information, redirect to home
    if (!orderId) {
      setTimeout(() => {
        navigate('/');
      }, 5000);
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="rounded-full bg-yellow-100 p-3 w-fit mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Information Missing</h1>
          <p className="text-gray-600 mb-6">
            It looks like you reached this page without completing an order. 
            You will be redirected to the homepage in a few seconds.
          </p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="rounded-full bg-green-100 p-4 w-fit mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isStripePayment ? 'Order Submitted!' : 'Order Confirmed!'}
          </h1>
          <p className="text-gray-600">
            {isStripePayment 
              ? 'Your order has been submitted and is awaiting payment.' 
              : 'Thank you for your purchase. Your order has been received.'}
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-medium capitalize">{orderStatus?.replace('_', ' ') || 'Processing'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="font-medium">${orderTotal?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          
          {isStripePayment && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-800">Payment in Progress</h3>
                  <p className="text-sm text-blue-600">
                    Please complete your payment in the Stripe checkout window that opened. If you closed it accidentally, 
                    you can try again from your order history.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-lg font-semibold mb-2">What Happens Next?</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>You will receive an order confirmation email shortly.</li>
              <li>The store will process your order and prepare it for shipment.</li>
              <li>Once shipped, you will receive tracking information (if available).</li>
              <li>Your items will be delivered according to the shipping method selected.</li>
            </ol>
          </div>
          
          <div className="border-t pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-sm text-gray-600">
              If you have any questions about your order, please contact customer support.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="whitespace-nowrap"
            >
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

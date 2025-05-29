
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PayPalCheckoutProps {
  amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  onSuccess?: (orderData: any) => void;
  onError?: (error: any) => void;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  items,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<any>(null);

  useEffect(() => {
    loadPayPalConfig();
  }, []);

  const loadPayPalConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the website ID from the current URL
      const pathParts = window.location.pathname.split('/');
      const websiteId = pathParts[pathParts.indexOf('view') + 1] || pathParts[pathParts.indexOf('site') + 1];
      
      if (!websiteId) return;

      const { data, error } = await supabase
        .from('websites')
        .select('settings')
        .eq('id', websiteId)
        .single();

      if (error) throw error;

      const settings = data?.settings as any;
      if (settings?.paypal?.enabled && settings?.paypal?.clientId) {
        setPaypalConfig(settings.paypal);
      }
    } catch (error) {
      console.error('Error loading PayPal config:', error);
    }
  };

  const handlePayPalCheckout = async () => {
    if (!paypalConfig?.clientId) {
      toast.error('PayPal is not configured for this store');
      return;
    }

    setIsLoading(true);

    try {
      // Create PayPal order
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          amount: amount.toFixed(2),
          items: items,
          currency: 'USD'
        }
      });

      if (error) throw error;

      if (data?.approval_url) {
        // Open PayPal checkout in a new tab
        window.open(data.approval_url, '_blank');
        
        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (error) {
      console.error('PayPal checkout error:', error);
      toast.error('Failed to initiate PayPal checkout');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!paypalConfig?.enabled) {
    return null;
  }

  return (
    <Button 
      onClick={handlePayPalCheckout}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Pay with PayPal - ${amount.toFixed(2)}
        </>
      )}
    </Button>
  );
};

export default PayPalCheckout;

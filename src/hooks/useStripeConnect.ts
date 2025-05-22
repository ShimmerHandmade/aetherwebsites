
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStripeConnect = (websiteId: string | undefined) => {
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStripeAccount = async () => {
    if (!websiteId) return;
    
    setIsLoading(true);
    try {
      // Use explicit typing with 'any' to avoid type checking for tables not in the schema
      const { data, error } = await supabase
        .from('stripe_connect_accounts' as any)
        .select('*')
        .eq('website_id', websiteId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching Stripe account:", error);
        toast.error("Failed to load payment settings");
      } else {
        setStripeAccount(data);
      }
    } catch (error) {
      console.error("Error in fetchStripeAccount:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshStripeAccount = async () => {
    setIsRefreshing(true);
    await fetchStripeAccount();
    setIsRefreshing(false);
  };

  const connectStripeAccount = async () => {
    if (!websiteId) return;
    
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { websiteId }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to create Stripe Connect account");
      }
      
      if (data?.url) {
        // Open Stripe Connect onboarding in a new tab
        window.open(data.url, '_blank');
        toast.success("Stripe Connect onboarding started");
        
        // Refresh Stripe account data after a delay
        setTimeout(() => {
          refreshStripeAccount();
        }, 3000);
        
        return { success: true, url: data.url };
      }
    } catch (error: any) {
      console.error("Error connecting Stripe:", error);
      toast.error(error.message || "Failed to connect with Stripe");
      return { success: false, error };
    } finally {
      setIsConnecting(false);
    }
  };
  
  useEffect(() => {
    fetchStripeAccount();
  }, [websiteId]);

  return {
    stripeAccount,
    isLoading,
    isConnecting,
    isRefreshing,
    connectStripeAccount,
    refreshStripeAccount
  };
};

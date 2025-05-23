
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStripeConnect = (websiteId: string | undefined) => {
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformError, setPlatformError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Enhanced fetchStripeAccount with better error handling
  const fetchStripeAccount = useCallback(async () => {
    if (!websiteId) return;
    
    setIsLoading(true);
    setError(null);
    setPlatformError(null);
    try {
      console.log("Fetching Stripe account for website:", websiteId);
      
      const { data, error } = await supabase
        .from('stripe_connect_accounts')
        .select('*')
        .eq('website_id', websiteId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching Stripe account:", error);
        setError(`Failed to load payment settings: ${error.message}`);
        toast.error("Failed to load payment settings");
      } else {
        console.log("Stripe account data:", data);
        setStripeAccount(data);
      }
    } catch (error: any) {
      console.error("Error in fetchStripeAccount:", error);
      setError(`An unexpected error occurred: ${error.message}`);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [websiteId]);
  
  // Improved refreshStripeAccount with better UX feedback
  const refreshStripeAccount = async () => {
    if (!websiteId) return;
    
    setIsRefreshing(true);
    setError(null);
    setPlatformError(null);
    
    try {
      console.log("Refreshing Stripe connection status");
      
      // If we have an account, try to check its status with the new edge function
      if (stripeAccount?.stripe_account_id) {
        try {
          const { data, error } = await supabase.functions.invoke('check-connect-status', {
            body: { accountId: stripeAccount.stripe_account_id }
          });
          
          if (error) {
            console.error("Error checking account status:", error);
          } else if (data?.updated) {
            console.log("Account status updated via edge function");
          }
        } catch (err) {
          console.error("Failed to check account status:", err);
        }
      }
      
      // Fetch the latest account data from the database
      await fetchStripeAccount();
      setLastRefresh(Date.now());
      toast.success("Stripe connection status refreshed");
    } catch (error: any) {
      console.error("Error refreshing account:", error);
      toast.error("Failed to refresh status");
    } finally {
      setIsRefreshing(false);
    }
  };

  const connectStripeAccount = async () => {
    if (!websiteId) {
      toast.error("No website selected");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    setPlatformError(null);
    try {
      console.log("Connecting Stripe for website:", websiteId);
      
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { websiteId }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        setError(`Failed to create Stripe Connect account: ${error.message}`);
        throw new Error(error.message || "Failed to create Stripe Connect account");
      }
      
      console.log("Edge function response:", data);
      
      if (data?.url) {
        // Open Stripe Connect onboarding in a new tab
        window.open(data.url, '_blank');
        toast.success("Stripe Connect onboarding started", {
          description: "After completing onboarding, return here and click refresh to update your status",
          duration: 6000
        });
        
        // Refresh Stripe account data after a delay
        setTimeout(() => {
          refreshStripeAccount();
        }, 5000);
        
        return { success: true, url: data.url };
      } else if (data?.error && data.error.includes("platform profile")) {
        // Handle the specific platform setup error
        const platformErrorMsg = "Your Stripe platform profile is incomplete. Please visit the Stripe Connect dashboard to complete your platform setup.";
        setPlatformError(platformErrorMsg);
        toast.error(platformErrorMsg, {
          duration: 8000,
          action: {
            label: "Open Stripe Dashboard",
            onClick: () => window.open("https://dashboard.stripe.com/connect/accounts/overview", "_blank"),
          },
        });
        return { success: false, platformError: true };
      } else {
        throw new Error("No URL returned from Stripe");
      }
    } catch (error: any) {
      console.error("Error connecting Stripe:", error);
      
      // Check if the error message contains platform profile information
      if (error.message && error.message.toLowerCase().includes("platform profile")) {
        const platformErrorMsg = "Your Stripe platform profile is incomplete. Please visit the Stripe Connect dashboard to complete your platform setup.";
        setPlatformError(platformErrorMsg);
        toast.error(platformErrorMsg, {
          duration: 8000,
          action: {
            label: "Open Stripe Dashboard",
            onClick: () => window.open("https://dashboard.stripe.com/connect/accounts/overview", "_blank"),
          },
        });
        return { success: false, platformError: true };
      } else {
        setError(error.message || "Failed to connect with Stripe");
        toast.error(error.message || "Failed to connect with Stripe");
      }
      
      return { success: false, error };
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Set up an interval to regularly check for account updates after onboarding
  useEffect(() => {
    fetchStripeAccount();
    
    // Poll for updates if we have a Stripe account that is not fully onboarded
    let pollingInterval: number | null = null;
    
    if (stripeAccount && !stripeAccount.onboarding_complete) {
      // Poll every 30 seconds for changes during the onboarding process
      pollingInterval = window.setInterval(() => {
        console.log("Polling for Stripe account updates...");
        refreshStripeAccount();
      }, 30000);
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [fetchStripeAccount, stripeAccount?.onboarding_complete]);

  return {
    stripeAccount,
    isLoading,
    isConnecting,
    isRefreshing,
    error,
    platformError,
    connectStripeAccount,
    refreshStripeAccount,
    lastRefresh
  };
};

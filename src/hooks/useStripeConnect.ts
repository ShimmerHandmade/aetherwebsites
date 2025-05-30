
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStripeConnect = (websiteId: string | undefined) => {
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformError, setPlatformError] = useState<string | null>(null);

  const fetchStripeAccount = async () => {
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
  };
  
  const refreshStripeAccount = async () => {
    setIsRefreshing(true);
    setError(null);
    setPlatformError(null);
    await fetchStripeAccount();
    setIsRefreshing(false);
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
        toast.success("Stripe Connect onboarding started");
        
        // Set up polling to check for completed onboarding
        const pollForCompletion = setInterval(async () => {
          console.log("Polling for Stripe onboarding completion...");
          await refreshStripeAccount();
          
          // Check if onboarding is complete
          const { data: accountData } = await supabase
            .from('stripe_connect_accounts')
            .select('onboarding_complete')
            .eq('website_id', websiteId)
            .maybeSingle();
          
          if (accountData?.onboarding_complete) {
            console.log("Stripe onboarding completed!");
            clearInterval(pollForCompletion);
            toast.success("Stripe Connect setup completed successfully!");
            await refreshStripeAccount();
          }
        }, 5000); // Poll every 5 seconds
        
        // Stop polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollForCompletion);
        }, 600000);
        
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
  
  useEffect(() => {
    fetchStripeAccount();
  }, [websiteId]);

  return {
    stripeAccount,
    isLoading,
    isConnecting,
    isRefreshing,
    error,
    platformError,
    connectStripeAccount,
    refreshStripeAccount
  };
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Opens the Stripe Customer Portal for subscription management
 */
export const openCustomerPortal = async (): Promise<{
  url: string | null;
  error?: string;
}> => {
  try {
    console.log("Opening customer portal...");
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke("customer-portal");
    
    if (error) {
      console.error("Error accessing customer portal:", error);
      toast.error("Failed to access subscription management portal");
      return {
        url: null,
        error: error.message,
      };
    }
    
    if (!data) {
      console.error("No data returned from customer portal");
      toast.error("Unable to generate subscription portal link");
      
      // Fallback to the fixed URL as requested
      return {
        url: "https://billing.stripe.com/p/login/5kQ6oI4i6a7naFL5Ls83C00",
      };
    }
    
    if (data.error) {
      console.error("Error from customer portal function:", data.error);
      
      // Show a more helpful error message if it's a configuration issue
      if (data.error.includes("configuration") || data.error.includes("portal")) {
        toast.error("The subscription management portal is not configured correctly. Using direct link instead.");
      } else {
        toast.error(data.error);
      }
      
      // Fallback to the fixed URL as requested
      return {
        url: "https://billing.stripe.com/p/login/5kQ6oI4i6a7naFL5Ls83C00",
      };
    }
    
    if (!data.url) {
      console.error("No URL returned from customer portal");
      toast.error("Using direct portal link instead");
      
      // Fallback to the fixed URL as requested
      return {
        url: "https://billing.stripe.com/p/login/5kQ6oI4i6a7naFL5Ls83C00",
      };
    }
    
    console.log("Customer portal URL generated:", data.url);
    return {
      // Use the fixed URL instead of the dynamically generated one
      url: "https://billing.stripe.com/p/login/5kQ6oI4i6a7naFL5Ls83C00", 
    };
  } catch (err) {
    console.error("Error in openCustomerPortal:", err);
    toast.error("An unexpected error occurred, using direct portal link");
    
    // Fallback to the fixed URL as requested
    return {
      url: "https://billing.stripe.com/p/login/5kQ6oI4i6a7naFL5Ls83C00",
    };
  }
};

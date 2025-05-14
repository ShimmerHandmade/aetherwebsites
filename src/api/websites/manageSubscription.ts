
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
    
    if (!data || !data.url) {
      console.error("No URL returned from customer portal");
      toast.error("Unable to generate subscription portal link");
      return {
        url: null,
        error: "No URL returned from customer portal"
      };
    }
    
    console.log("Customer portal URL generated successfully");
    return {
      url: data.url
    };
  } catch (err) {
    console.error("Error in openCustomerPortal:", err);
    toast.error("An unexpected error occurred");
    return {
      url: null,
      error: String(err)
    };
  }
};

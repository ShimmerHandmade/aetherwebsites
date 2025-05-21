
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
    
    // Return the direct portal URL as requested
    return {
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

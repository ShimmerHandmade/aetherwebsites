
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Opens the Stripe Customer Portal for subscription management
 */
export const openCustomerPortal = async (): Promise<{
  url: string | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke("customer-portal");
    
    if (error) {
      console.error("Error accessing customer portal:", error);
      toast({
        title: "Error",
        description: "Failed to access subscription management portal",
        variant: "destructive",
      });
      return {
        url: null,
        error: error.message,
      };
    }
    
    return {
      url: data?.url || null
    };
  } catch (err) {
    console.error("Error in openCustomerPortal:", err);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return {
      url: null,
      error: String(err)
    };
  }
};

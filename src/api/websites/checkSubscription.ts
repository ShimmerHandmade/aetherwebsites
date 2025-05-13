
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Calls the check-subscription edge function to refresh subscription status
 */
export const checkSubscription = async (): Promise<{
  success: boolean;
  subscribed: boolean;
  plan: any | null;
  error?: string;
}> => {
  try {
    // Call the edge function to check subscription status with explicit GET method
    const { data, error } = await supabase.functions.invoke("check-subscription", {
      method: "GET"
    });
    
    if (error) {
      console.error("Error checking subscription:", error);
      return {
        success: false,
        subscribed: false,
        plan: null,
        error: error.message
      };
    }

    console.log("Subscription check response:", data);

    // Return the subscription status
    return {
      success: true,
      subscribed: data.subscribed,
      plan: data.plan,
      error: undefined
    };
  } catch (err) {
    console.error("Error in checkSubscription:", err);
    return {
      success: false,
      subscribed: false,
      plan: null,
      error: String(err)
    };
  }
};


import { supabase } from "@/integrations/supabase/client";

export interface UserPlan {
  id: string | null;
  name: string | null;
  isSubscribed: boolean;
  subscriptionEnd: string | null;
}

/**
 * Fetches the current user's plan information directly from the database
 */
export const getUserPlan = async (): Promise<{
  data: UserPlan | null;
  error?: string;
}> => {
  try {
    // Check for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        data: null,
        error: "No authenticated user"
      };
    }

    // Get user profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return {
        data: null,
        error: "Failed to fetch user profile information"
      };
    }
    
    // If no plan_id, return early with default values
    if (!profile.plan_id) {
      return {
        data: {
          id: null,
          name: null,
          isSubscribed: false,
          subscriptionEnd: null
        }
      };
    }
    
    // Get plan details directly - using a separate query to avoid join issues
    const { data: planData } = await supabase
      .from("plans")
      .select("name")
      .eq("id", profile.plan_id)
      .single();
    
    // Check if subscription is active
    const isSubscribed = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    return {
      data: {
        id: profile.plan_id,
        name: planData?.name || null,
        isSubscribed,
        subscriptionEnd: profile.subscription_end
      }
    };
  } catch (error) {
    console.error("Error in getUserPlan:", error);
    return {
      data: null,
      error: "An unexpected error occurred"
    };
  }
};

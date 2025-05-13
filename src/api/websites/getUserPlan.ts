
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

    // Get user profile with plan information
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans:plan_id(*)")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user plan:", error);
      return {
        data: null,
        error: "Failed to fetch user plan information"
      };
    }
    
    // Check if subscription is active
    const isSubscribed = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    // Extract plan info from the profile
    const planData = profile.plans;
    const planName = planData && typeof planData === 'object' && 'name' in planData 
      ? (planData as any).name 
      : null;
    const planId = profile.plan_id;
    
    console.log("User plan data:", { planId, planName, isSubscribed });
    
    return {
      data: {
        id: planId,
        name: planName,
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

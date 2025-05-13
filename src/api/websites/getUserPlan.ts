
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
      console.log("getUserPlan: No authenticated user found");
      return {
        data: null,
        error: "No authenticated user"
      };
    }

    // Get user profile without joining plans table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return {
        data: null,
        error: "Failed to fetch user profile information"
      };
    }
    
    // Check if subscription is active
    const isSubscribed = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    // Get plan details if we have a plan_id
    let planName = null;
    const planId = profile.plan_id;
    
    if (planId) {
      // Get the plan details directly
      const { data: planData } = await supabase
        .from("plans")
        .select("name")
        .eq("id", planId)
        .maybeSingle();
      
      if (planData) {
        planName = planData.name;
        console.log("Retrieved plan name directly:", planName);
      }
    }
    
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

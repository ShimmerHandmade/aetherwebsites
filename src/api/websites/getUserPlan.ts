
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

    // Get user profile with plan join in a single query when possible
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id, plans:plan_id(name)")
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
    
    // Get plan name from the join if available
    let planName = null;
    if (profile.plans && typeof profile.plans === 'object' && profile.plans !== null) {
      planName = (profile.plans as any).name;
    }
    
    // If plan name wasn't in the join, fetch it separately
    if (!planName) {
      const { data: planData } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .single();
      
      planName = planData?.name || null;
    }
    
    // Check if subscription is active
    const isSubscribed = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    // Log plan data for debugging
    console.log("User plan data:", {
      planId: profile.plan_id,
      planName,
      isSubscribed
    });
    
    return {
      data: {
        id: profile.plan_id,
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

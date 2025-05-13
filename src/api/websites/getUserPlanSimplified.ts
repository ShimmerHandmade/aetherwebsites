
import { supabase } from "@/integrations/supabase/client";

interface SimplifiedPlanInfo {
  planName: string | null;
  subscriptionEnd: string | null;
  isActive: boolean;
}

/**
 * Gets simplified plan information that avoids database joins
 * which can cause errors when the relationships aren't set up properly
 */
export const getUserPlanSimplified = async (): Promise<SimplifiedPlanInfo> => {
  try {
    // Check for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("getUserPlanSimplified: No authenticated user");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }

    // Get user profile information
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    if (!profile || !profile.is_subscribed || !profile.plan_id) {
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    // Check if subscription is still active based on end date
    const isActive = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    if (!isActive) {
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    // Fetch plan separately
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .select("name")
      .eq("id", profile.plan_id)
      .maybeSingle();
    
    if (planError || !planData) {
      console.error("Error fetching plan:", planError);
      return {
        planName: null,
        subscriptionEnd: profile.subscription_end,
        isActive: true
      };
    }
    
    return {
      planName: planData.name,
      subscriptionEnd: profile.subscription_end,
      isActive: true
    };
  } catch (error) {
    console.error("Error in getUserPlanSimplified:", error);
    return {
      planName: null,
      subscriptionEnd: null,
      isActive: false
    };
  }
};

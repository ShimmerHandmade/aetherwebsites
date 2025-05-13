
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

    // Get user profile with plan info without using a join
    // Use maybeSingle to avoid errors if no record is found
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return {
        data: null,
        error: "Failed to fetch user profile information"
      };
    }
    
    if (!profile || !profile.plan_id) {
      return {
        data: {
          id: null,
          name: null,
          isSubscribed: false,
          subscriptionEnd: null
        },
        error: undefined
      };
    }

    // Fetch plan separately if we have a plan_id
    let planName = null;
    if (profile.plan_id) {
      const { data: planData, error: planError } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
      
      if (!planError && planData) {
        planName = planData.name;
      }
    }
    
    // Check if subscription is active
    const isSubscribed = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    console.log("Plan data retrieved:", {
      id: profile.plan_id,
      name: planName,
      isSubscribed,
      subscriptionEnd: profile.subscription_end
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

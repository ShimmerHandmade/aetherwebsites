
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
    console.log("🔄 getUserPlanSimplified: Starting...");
    
    // Check for authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("❌ getUserPlanSimplified: Auth error:", authError);
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    if (!user) {
      console.log("🔄 getUserPlanSimplified: No authenticated user");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }

    console.log("👤 getUserPlanSimplified: User found:", user.id);

    // Get user profile information
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id")
      .eq("id", user.id)
      .maybeSingle();
    
    console.log("📊 getUserPlanSimplified: Profile query result:", {
      profile,
      error: profileError
    });
    
    if (profileError) {
      console.error("❌ getUserPlanSimplified: Error fetching profile:", profileError);
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    if (!profile) {
      console.log("🔄 getUserPlanSimplified: No profile found for user");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    if (!profile.is_subscribed || !profile.plan_id) {
      console.log("🔄 getUserPlanSimplified: User not subscribed or no plan_id");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    // Check if subscription is still active based on end date
    const isActive = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    console.log("📅 getUserPlanSimplified: Subscription status:", {
      is_subscribed: profile.is_subscribed,
      subscription_end: profile.subscription_end,
      isActive
    });
    
    if (!isActive) {
      console.log("🔄 getUserPlanSimplified: Subscription not active");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    // Fetch plan separately
    console.log("🔄 getUserPlanSimplified: Fetching plan with ID:", profile.plan_id);
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .select("name")
      .eq("id", profile.plan_id)
      .maybeSingle();
    
    console.log("📊 getUserPlanSimplified: Plan query result:", {
      planData,
      error: planError
    });
    
    if (planError || !planData) {
      console.error("❌ getUserPlanSimplified: Error fetching plan:", planError);
      return {
        planName: null,
        subscriptionEnd: profile.subscription_end,
        isActive: true
      };
    }
    
    const result = {
      planName: planData.name,
      subscriptionEnd: profile.subscription_end,
      isActive: true
    };
    
    console.log("✅ getUserPlanSimplified: Final result:", result);
    return result;
  } catch (error) {
    console.error("❌ getUserPlanSimplified: Unexpected error:", error);
    return {
      planName: null,
      subscriptionEnd: null,
      isActive: false
    };
  }
};

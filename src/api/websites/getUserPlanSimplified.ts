
import { supabase } from "@/integrations/supabase/client";

interface SimplifiedPlanInfo {
  planName: string | null;
  subscriptionEnd: string | null;
  isActive: boolean;
}

export const getUserPlanSimplified = async (): Promise<SimplifiedPlanInfo> => {
  try {
    console.log("🔄 getUserPlanSimplified: Starting...");
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log("🔄 getUserPlanSimplified: No authenticated user");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }

    console.log("👤 getUserPlanSimplified: User found:", user.id);

    // Get user profile with plan info in one query
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id, plans(name)")
      .eq("id", user.id)
      .maybeSingle();
    
    console.log("📊 getUserPlanSimplified: Profile query result:", {
      profile,
      error: profileError
    });
    
    if (profileError || !profile) {
      console.log("🔄 getUserPlanSimplified: No profile found");
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }
    
    // Check if subscription is active
    const isActive = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
    
    if (!isActive) {
      console.log("🔄 getUserPlanSimplified: Subscription not active");
      return {
        planName: null,
        subscriptionEnd: profile.subscription_end,
        isActive: false
      };
    }
    
    // Get plan name with null safety
    let planName = null;
    
    if (profile.plans && typeof profile.plans === 'object' && profile.plans !== null && 'name' in profile.plans) {
      planName = (profile.plans as { name: string }).name;
    } else if (profile.plan_id) {
      // Fallback query
      const { data: planData } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
      
      planName = planData?.name || null;
    }
    
    const result = {
      planName,
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

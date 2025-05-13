
import { supabase } from "@/integrations/supabase/client";

/**
 * A simplified version of getUserPlan that directly queries the database
 * for the most basic plan information
 */
export const getUserPlanSimplified = async (): Promise<{
  planName: string | null;
  subscriptionEnd: string | null;
  isActive: boolean;
}> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }

    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_id, is_subscribed, subscription_end")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.plan_id || !profile.is_subscribed) {
      return {
        planName: null,
        subscriptionEnd: null,
        isActive: false
      };
    }

    // Get plan name
    const { data: plan } = await supabase
      .from("plans")
      .select("name")
      .eq("id", profile.plan_id)
      .single();

    return {
      planName: plan?.name || null,
      subscriptionEnd: profile.subscription_end,
      isActive: profile.is_subscribed && 
        (!profile.subscription_end || new Date(profile.subscription_end) > new Date())
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

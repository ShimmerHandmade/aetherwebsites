
import { Plan } from "@/api/websites";
import { Profile } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface PlanRestriction {
  maxProducts: number;
  allowCoupons: boolean;
  allowDiscounts: boolean;
  allowAdvancedAnalytics: boolean;
  allowCustomDomain: boolean;
  maxPages: number;
  allowPremiumTemplates: boolean;
  allowPremiumElements: boolean;
}

// Define restrictions for each plan tier
const planRestrictions: Record<string, PlanRestriction> = {
  "Basic": {
    maxProducts: 20,
    allowCoupons: false,
    allowDiscounts: false,
    allowAdvancedAnalytics: false,
    allowCustomDomain: false,
    maxPages: 5,
    allowPremiumTemplates: false,
    allowPremiumElements: false
  },
  "Professional": {
    maxProducts: 100,
    allowCoupons: true,
    allowDiscounts: false,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    maxPages: 20,
    allowPremiumTemplates: true,
    allowPremiumElements: false
  },
  "Enterprise": {
    maxProducts: 1000,
    allowCoupons: true,
    allowDiscounts: true,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    maxPages: 100,
    allowPremiumTemplates: true,
    allowPremiumElements: true
  },
  // Default restrictions for users without a plan
  "default": {
    maxProducts: 10,
    allowCoupons: false,
    allowDiscounts: false,
    allowAdvancedAnalytics: false,
    allowCustomDomain: false,
    maxPages: 3,
    allowPremiumTemplates: false,
    allowPremiumElements: false
  }
};

// Get the user's current plan restrictions
export async function getUserPlanRestrictions(): Promise<PlanRestriction> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return planRestrictions.default;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .single();
    
    console.log("Profile data from DB:", profile);
    
    if (error || !profile?.is_subscribed || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      console.log("No active subscription found, using default restrictions");
      return planRestrictions.default;
    }

    // Check if plans data is valid and has a name property
    const planData = profile.plans;
    
    // If no plan data, use default restrictions
    if (!planData) {
      console.log("No plan data found, using default restrictions");
      return planRestrictions.default;
    }
    
    // Fixed TS error: planData is possibly null - separate null check from property access
    let planName = 'default';
    if (planData !== null && typeof planData === 'object' && 'name' in planData) {
      planName = (planData as any).name as string;
    }
    
    console.log("Plan name:", planName);
    
    // Check if this plan exists in our restrictions mapping
    if (planName && planRestrictions[planName]) {
      console.log(`Using restrictions for plan: ${planName}`);
      return planRestrictions[planName];
    }
    
    console.log("Plan not found in restrictions, using default");
    return planRestrictions.default;
  } catch (error) {
    console.error("Error getting user plan restrictions:", error);
    return planRestrictions.default;
  }
}

// Check if a specific feature is allowed for the current user
export async function checkFeatureAccess(feature: keyof PlanRestriction): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  return restrictions[feature] === true;
}

// Check if adding another product would exceed the user's plan limit
export async function checkProductLimit(currentCount: number): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  const belowLimit = currentCount < restrictions.maxProducts;
  
  if (!belowLimit) {
    toast({
      variant: "destructive",
      title: `You've reached your plan's limit of ${restrictions.maxProducts} products`, 
      description: "Upgrade your plan to add more products"
    });
  }
  
  return belowLimit;
}

// Get the current user's plan name
export async function getUserPlanName(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user found, returning null plan name");
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .single();
    
    console.log("Profile data for plan name:", profile);
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    if (!profile?.is_subscribed || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      console.log("No active subscription, returning null plan name");
      return null;
    }

    // Check if plans data is valid and has a name property
    const planData = profile.plans;
    if (!planData) {
      console.log("No plan data found, returning null plan name");
      return null;
    }
    
    // Fixed TS error: planData is possibly null - separate null check
    let planName: string | null = null;
    if (planData !== null && typeof planData === 'object' && 'name' in planData) {
      planName = (planData as any).name as string;
    }
    
    console.log("Returning plan name:", planName);
    return planName;
  } catch (error) {
    console.error("Error getting user plan:", error);
    return null;
  }
}


import { Plan } from "@/api/websites";
import { Profile } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      .select("*, plans:plan_id(*)")
      .eq("id", user.id)
      .single();
    
    if (error || !profile?.is_subscribed || !profile.plans || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      return planRestrictions.default;
    }

    // Check if plans data is valid and has a name property
    const planData = profile.plans;
    if (!planData) return planRestrictions.default;
    
    // Use non-null assertion since we've already checked planData is not null
    const planName = typeof planData === 'object' && 'name' in planData! 
      ? (planData as any).name as string 
      : 'default';
    
    return planRestrictions[planName] || planRestrictions.default;
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
    toast.error(`You've reached your plan's limit of ${restrictions.maxProducts} products`, {
      description: "Upgrade your plan to add more products"
    });
  }
  
  return belowLimit;
}

// Get the current user's plan name
export async function getUserPlanName(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans:plan_id(*)")
      .eq("id", user.id)
      .single();
    
    if (error || !profile?.is_subscribed || !profile.plans || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      return null;
    }

    // Check if plans data is valid and has a name property
    const planData = profile.plans;
    if (!planData) return null;
    
    // Use non-null assertion since we've already checked planData is not null
    return typeof planData === 'object' && 'name' in planData! 
      ? (planData as any).name as string 
      : null;
  } catch (error) {
    console.error("Error getting user plan:", error);
    return null;
  }
}

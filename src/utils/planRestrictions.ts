
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
  },
  "Professional": {
    maxProducts: 100,
    allowCoupons: true,
    allowDiscounts: false,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    maxPages: 20,
  },
  "Enterprise": {
    maxProducts: 1000,
    allowCoupons: true,
    allowDiscounts: true,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    maxPages: 100,
  },
  // Default restrictions for users without a plan
  "default": {
    maxProducts: 10,
    allowCoupons: false,
    allowDiscounts: false,
    allowAdvancedAnalytics: false,
    allowCustomDomain: false,
    maxPages: 3,
  }
};

// Get the user's current plan restrictions
export async function getUserPlanRestrictions(): Promise<PlanRestriction> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return planRestrictions.default;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*, plans:plan_id(*)")
      .eq("id", user.id)
      .single();

    // If user has no plan or plan subscription is expired, use default restrictions
    if (!profile?.is_subscribed || !profile.plans || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      return planRestrictions.default;
    }

    // Get the plan name and return corresponding restrictions
    const planName = profile.plans.name;
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("*, plans:plan_id(*)")
      .eq("id", user.id)
      .single();

    // Check if user has an active subscription
    if (!profile?.is_subscribed || !profile.plans || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      return null;
    }

    return profile.plans.name;
  } catch (error) {
    console.error("Error getting user plan:", error);
    return null;
  }
}

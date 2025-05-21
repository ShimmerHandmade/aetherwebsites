
import { Plan } from "@/api/websites";
import { Profile } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlanRestriction {
  maxProducts: number;
  maxWebsites: number;
  allowCoupons: boolean;
  allowDiscounts: boolean;
  allowAdvancedAnalytics: boolean;
  allowCustomDomain: boolean;
  allowPremiumTemplates: boolean;
  allowPremiumElements: boolean;
  allowPremiumAnimations: boolean;
  allowedThemes: string[];
}

// Define restrictions for each plan tier with more fair features
const planRestrictions: Record<string, PlanRestriction> = {
  "Basic": {
    maxProducts: 30,
    maxWebsites: 1,
    allowCoupons: true,
    allowDiscounts: false,
    allowAdvancedAnalytics: false,
    allowCustomDomain: false,
    allowPremiumTemplates: false,
    allowPremiumElements: false,
    allowPremiumAnimations: false,
    allowedThemes: ["business", "blog", "ecommerce"]
  },
  "Professional": {
    maxProducts: 150,
    maxWebsites: 3,
    allowCoupons: true,
    allowDiscounts: true,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    allowPremiumTemplates: true,
    allowPremiumElements: true,
    allowPremiumAnimations: true,
    allowedThemes: ["business", "blog", "ecommerce", "fashion", "electronics", "jewelry", "beauty", "food", "furniture", "portfolio"]
  },
  "Enterprise": {
    maxProducts: 1500,
    maxWebsites: 5,
    allowCoupons: true,
    allowDiscounts: true,
    allowAdvancedAnalytics: true,
    allowCustomDomain: true,
    allowPremiumTemplates: true,
    allowPremiumElements: true,
    allowPremiumAnimations: true,
    allowedThemes: ["business", "blog", "ecommerce", "fashion", "electronics", "jewelry", "beauty", "food", "furniture", "portfolio"]
  },
  // Default restrictions for users without a plan
  "default": {
    maxProducts: 15,
    maxWebsites: 1,
    allowCoupons: false,
    allowDiscounts: false,
    allowAdvancedAnalytics: false,
    allowCustomDomain: false,
    allowPremiumTemplates: false,
    allowPremiumElements: false,
    allowPremiumAnimations: false,
    allowedThemes: ["business", "blog", "ecommerce"]
  }
};

// Get the user's current plan restrictions
export async function getUserPlanRestrictions(): Promise<PlanRestriction> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("getUserPlanRestrictions: No authenticated user found");
      return planRestrictions.default;
    }

    // Get the user profile first
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .maybeSingle();
    
    console.log("Profile data from DB:", profile);
    
    if (error || !profile?.is_subscribed || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      console.log("No active subscription found, using default restrictions");
      return planRestrictions.default;
    }

    // Check if plans data is valid
    const planData = profile.plans;
    
    // If no plan data but we have a plan_id, try to get the plan directly
    if ((planData === null || typeof planData !== 'object') && profile.plan_id) {
      console.log("No plan data in profile relation, trying direct query with plan_id:", profile.plan_id);
      const { data: directPlan, error: directPlanError } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
        
      if (!directPlanError && directPlan && directPlan.name) {
        console.log("Retrieved plan name directly:", directPlan.name);
        // Check if this plan exists in our restrictions mapping
        if (planRestrictions[directPlan.name]) {
          console.log(`Using restrictions for plan: ${directPlan.name}`);
          return planRestrictions[directPlan.name];
        }
      }
      
      console.log("Could not find plan by ID, using default");
      return planRestrictions.default;
    }
    
    // Get the plan name with additional safeguards
    let planName = 'default';
    if (planData !== null && typeof planData === 'object' && planData && 'name' in planData) {
      planName = ((planData as any).name as string) || 'default';
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

// Check if the specified theme is allowed for the current user's plan
export async function checkThemeAccess(themeName: string): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  return restrictions.allowedThemes.includes(themeName);
}

// Check if adding another product would exceed the user's plan limit
export async function checkProductLimit(currentCount: number): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  const belowLimit = currentCount < restrictions.maxProducts;
  
  if (!belowLimit) {
    toast({
      title: "Plan Limit Reached",
      description: `You've reached your plan's limit of ${restrictions.maxProducts} products. Upgrade your plan to add more products.`,
      duration: 5000,
    });
  }
  
  return belowLimit;
}

// Check website limits
export async function checkWebsiteLimit(currentCount: number): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  const belowLimit = currentCount < restrictions.maxWebsites;
  
  if (!belowLimit) {
    toast({
      title: "Website Limit Reached",
      description: `You've reached your plan's limit of ${restrictions.maxWebsites} websites. Upgrade your plan to add more websites.`,
      duration: 5000,
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

    // Get the user profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .maybeSingle();
    
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

    // Try to get the plan name in multiple ways
    let planName: string | null = null;
    
    // First try from the plans join
    const planData = profile.plans;
    if (planData !== null && typeof planData === 'object' && planData && 'name' in planData) {
      planName = (planData as any).name as string;
      console.log("Got plan name from joined data:", planName);
    }
    
    // If that failed but we have a plan_id, try direct query
    if (!planName && profile.plan_id) {
      console.log("Trying direct query for plan name with ID:", profile.plan_id);
      const { data: directPlan, error: planError } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
        
      if (!planError && directPlan) {
        planName = directPlan.name;
        console.log("Got plan name from direct query:", planName);
      }
    }
    
    console.log("Returning plan name:", planName);
    return planName;
  } catch (error) {
    console.error("Error getting user plan:", error);
    return null;
  }
}

// Check if premium features are available
export async function isPremiumPlan(): Promise<boolean> {
  const planName = await getUserPlanName();
  return planName === "Professional" || planName === "Enterprise";
}

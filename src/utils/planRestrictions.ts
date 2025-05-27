
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
    allowedThemes: ["business", "blog", "ecommerce", "fashion", "electronics", "food"]
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
    allowedThemes: ["business", "blog", "ecommerce", "fashion", "electronics", "food"]
  }
};

export async function getUserPlanRestrictions(): Promise<PlanRestriction> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user found");
      return planRestrictions.default;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return planRestrictions.default;
    }
    
    if (!profile?.is_subscribed || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      console.log("No active subscription");
      return planRestrictions.default;
    }

    let planName = 'default';
    const planData = profile.plans;
    
    // Check if planData is a valid object with a name property
    if (planData && typeof planData === 'object' && 'name' in planData) {
      const name = (planData as any).name;
      if (typeof name === 'string') {
        planName = name;
      }
    } else if (profile.plan_id) {
      const { data: directPlan } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
        
      if (directPlan?.name) {
        planName = directPlan.name;
      }
    }
    
    console.log("Using plan restrictions for:", planName);
    return planRestrictions[planName] || planRestrictions.default;
  } catch (error) {
    console.error("Error getting user plan restrictions:", error);
    return planRestrictions.default;
  }
}

export async function checkFeatureAccess(feature: keyof PlanRestriction): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  return restrictions[feature] === true;
}

export async function checkThemeAccess(themeName: string): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  return restrictions.allowedThemes.includes(themeName);
}

export async function checkProductLimit(currentCount: number): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  const belowLimit = currentCount < restrictions.maxProducts;
  
  if (!belowLimit) {
    toast.error("Plan Limit Reached", {
      description: `You've reached your plan's limit of ${restrictions.maxProducts} products. Upgrade your plan to add more products.`
    });
  }
  
  return belowLimit;
}

export async function checkWebsiteLimit(currentCount: number): Promise<boolean> {
  const restrictions = await getUserPlanRestrictions();
  const belowLimit = currentCount < restrictions.maxWebsites;
  
  if (!belowLimit) {
    toast.error("Website Limit Reached", {
      description: `You've reached your plan's limit of ${restrictions.maxWebsites} websites. Upgrade your plan to add more websites.`
    });
  }
  
  return belowLimit;
}

export async function getUserPlanName(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .maybeSingle();
    
    if (error || !profile?.is_subscribed || 
        (profile.subscription_end && new Date(profile.subscription_end) < new Date())) {
      return null;
    }

    const planData = profile.plans;
    
    // Check if planData is a valid object with a name property
    if (planData && typeof planData === 'object' && 'name' in planData) {
      const name = (planData as any).name;
      if (typeof name === 'string') {
        return name;
      }
    }
    
    if (profile.plan_id) {
      const { data: directPlan } = await supabase
        .from("plans")
        .select("name")
        .eq("id", profile.plan_id)
        .maybeSingle();
        
      return directPlan?.name || null;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user plan:", error);
    return null;
  }
}

export async function isPremiumPlan(): Promise<boolean> {
  const planName = await getUserPlanName();
  return planName === "Professional" || planName === "Enterprise";
}

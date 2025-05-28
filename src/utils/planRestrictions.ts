
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

// Default restrictions for free/basic users
const DEFAULT_RESTRICTIONS: PlanRestriction = {
  maxProducts: 15,
  maxWebsites: 1,
  allowCoupons: false,
  allowDiscounts: false,
  allowAdvancedAnalytics: false,
  allowCustomDomain: false,
  allowPremiumTemplates: false,
  allowPremiumElements: false,
  allowPremiumAnimations: false,
  allowedThemes: [
    "business",
    "blog", 
    "ecommerce",
    "fashion",
    "electronics", 
    "food"
  ]
};

/**
 * Gets plan restrictions for the current user
 * Returns default restrictions if no user is authenticated
 */
export const getUserPlanRestrictions = async (): Promise<PlanRestriction> => {
  try {
    // Check if user is authenticated without throwing errors
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No authenticated user found");
      return DEFAULT_RESTRICTIONS;
    }

    console.log("Fetching restrictions for authenticated user:", session.user.id);

    // Get user profile to check subscription status
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        is_subscribed,
        subscription_end,
        plan_id,
        plans (
          name
        )
      `)
      .eq("id", session.user.id)
      .maybeSingle();

    if (error || !profile) {
      console.log("No profile found or error, using default restrictions:", error?.message);
      return DEFAULT_RESTRICTIONS;
    }

    // Check if subscription is active
    const hasActiveSubscription = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());

    if (!hasActiveSubscription) {
      console.log("No active subscription, using default restrictions");
      return DEFAULT_RESTRICTIONS;
    }

    // Get plan name with proper type checking - fix the TypeScript null issue
    let planName = null;
    const plans = profile.plans;
    if (plans && typeof plans === 'object' && 'name' in plans) {
      planName = (plans as { name: string }).name;
    }

    console.log("User plan:", planName);

    // Return restrictions based on plan
    switch (planName) {
      case "Professional":
        return {
          maxProducts: 150,
          maxWebsites: 3,
          allowCoupons: true,
          allowDiscounts: true,
          allowAdvancedAnalytics: false,
          allowCustomDomain: false,
          allowPremiumTemplates: true,
          allowPremiumElements: true,
          allowPremiumAnimations: true,
          allowedThemes: [
            "business", "blog", "ecommerce", "fashion", "electronics", "food",
            "beauty", "furniture", "jewelry"
          ]
        };
      
      case "Enterprise":
        return {
          maxProducts: 1000,
          maxWebsites: 5,
          allowCoupons: true,
          allowDiscounts: true,
          allowAdvancedAnalytics: true,
          allowCustomDomain: true,
          allowPremiumTemplates: true,
          allowPremiumElements: true,
          allowPremiumAnimations: true,
          allowedThemes: [
            "business", "blog", "ecommerce", "fashion", "electronics", "food",
            "beauty", "furniture", "jewelry"
          ]
        };
      
      default:
        console.log("Unknown plan or Basic plan, using enhanced basic restrictions");
        return {
          maxProducts: 30,
          maxWebsites: 1,
          allowCoupons: true,
          allowDiscounts: false,
          allowAdvancedAnalytics: false,
          allowCustomDomain: false,
          allowPremiumTemplates: false,
          allowPremiumElements: false,
          allowPremiumAnimations: false,
          allowedThemes: [
            "business", "blog", "ecommerce", "fashion", "electronics", "food"
          ]
        };
    }
  } catch (error) {
    console.error("Error fetching plan restrictions:", error);
    return DEFAULT_RESTRICTIONS;
  }
};

/**
 * Check if a specific theme is allowed for the current user
 */
export const checkThemeAccess = async (themeName: string): Promise<boolean> => {
  try {
    const restrictions = await getUserPlanRestrictions();
    const hasAccess = restrictions.allowedThemes.includes(themeName);
    console.log(`Theme ${themeName} access: ${hasAccess}, allowed themes:`, restrictions.allowedThemes);
    return hasAccess;
  } catch (error) {
    console.error("Error checking theme access:", error);
    return false;
  }
};

/**
 * Check if user can add more products based on their plan limits
 */
export const checkProductLimit = async (currentProductCount: number): Promise<boolean> => {
  try {
    const restrictions = await getUserPlanRestrictions();
    const canAddProduct = currentProductCount < restrictions.maxProducts;
    
    if (!canAddProduct) {
      toast.error(`You've reached your plan's limit of ${restrictions.maxProducts} products`, {
        description: "Upgrade your plan to add more products"
      });
    }
    
    return canAddProduct;
  } catch (error) {
    console.error("Error checking product limit:", error);
    return false;
  }
};

/**
 * Check if user can add more websites based on their plan limits
 */
export const checkWebsiteLimit = async (currentWebsiteCount: number): Promise<boolean> => {
  try {
    const restrictions = await getUserPlanRestrictions();
    const canAddWebsite = currentWebsiteCount < restrictions.maxWebsites;
    
    if (!canAddWebsite) {
      toast.error(`You've reached your plan's limit of ${restrictions.maxWebsites} websites`, {
        description: "Upgrade your plan to create more websites"
      });
    }
    
    return canAddWebsite;
  } catch (error) {
    console.error("Error checking website limit:", error);
    return false;
  }
};

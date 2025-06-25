
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

// Cache to prevent repeated API calls
let restrictionsCache: { 
  data: PlanRestriction | null;
  timestamp: number;
  userId: string | null;
} = {
  data: null,
  timestamp: 0,
  userId: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Gets plan restrictions for the current user
 * Returns default restrictions if no user is authenticated
 */
export const getUserPlanRestrictions = async (): Promise<PlanRestriction> => {
  try {
    // Check cache first
    const now = Date.now();
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || null;
    
    if (restrictionsCache.data && 
        restrictionsCache.userId === currentUserId &&
        (now - restrictionsCache.timestamp) < CACHE_DURATION) {
      console.log("📋 Using cached restrictions");
      return restrictionsCache.data;
    }
    
    if (!session?.user) {
      console.log("👤 No authenticated user, using default restrictions");
      const restrictions = DEFAULT_RESTRICTIONS;
      restrictionsCache = {
        data: restrictions,
        timestamp: now,
        userId: null
      };
      return restrictions;
    }

    console.log("🔍 Fetching restrictions for user:", session.user.id);

    // Get user profile to check subscription status
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_end, plan_id")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.warn("⚠️ Profile fetch error, using defaults:", error.message);
      return DEFAULT_RESTRICTIONS;
    }

    if (!profile) {
      console.log("👤 No profile found, using default restrictions");
      return DEFAULT_RESTRICTIONS;
    }

    // Check if subscription is active
    const hasActiveSubscription = profile.is_subscribed && 
      (!profile.subscription_end || new Date(profile.subscription_end) > new Date());

    if (!hasActiveSubscription) {
      console.log("💳 No active subscription, using default restrictions");
      const restrictions = DEFAULT_RESTRICTIONS;
      restrictionsCache = {
        data: restrictions,
        timestamp: now,
        userId: currentUserId
      };
      return restrictions;
    }

    // Get plan details if we have a plan_id
    let planName: string | null = null;
    
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

    console.log("📊 User plan determined:", planName);

    let restrictions: PlanRestriction;

    // Return restrictions based on plan
    switch (planName?.toLowerCase()) {
      case "professional":
        restrictions = {
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
        break;
      
      case "enterprise":
        restrictions = {
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
        break;
      
      case "free enterprise":
        restrictions = {
          maxProducts: 500,
          maxWebsites: 3,
          allowCoupons: true,
          allowDiscounts: true,
          allowAdvancedAnalytics: true,
          allowCustomDomain: false,
          allowPremiumTemplates: true,
          allowPremiumElements: true,
          allowPremiumAnimations: true,
          allowedThemes: [
            "business", "blog", "ecommerce", "fashion", "electronics", "food",
            "beauty", "furniture", "jewelry"
          ]
        };
        break;
      
      default:
        restrictions = {
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
        break;
    }

    // Cache the result
    restrictionsCache = {
      data: restrictions,
      timestamp: now,
      userId: currentUserId
    };

    return restrictions;
  } catch (error) {
    console.error("💥 Error fetching plan restrictions:", error);
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
    console.log(`🎨 Theme ${themeName} access: ${hasAccess}`);
    return hasAccess;
  } catch (error) {
    console.error("💥 Error checking theme access:", error);
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
    console.error("💥 Error checking product limit:", error);
    return true; // Allow if check fails
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
        description: "Upgrade your plan to add more websites"
      });
    }
    
    return canAddWebsite;
  } catch (error) {
    console.error("💥 Error checking website limit:", error);
    return true; // Allow if check fails
  }
};

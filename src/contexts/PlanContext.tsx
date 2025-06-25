
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { usePlanInfo, PlanInfo } from "@/hooks/usePlanInfo";
import { toast } from "sonner";
import { checkThemeAccess } from "@/utils/planRestrictions";

// Create context with default values
const PlanContext = createContext<PlanInfo & {
  checkUpgrade: (feature: string, isPremiumOnly?: boolean) => boolean;
  isThemeAllowed: (themeName: string) => Promise<boolean>;
}>({
  planName: null,
  restrictions: null,
  loading: true,
  error: null,
  isPremium: false,
  isEnterprise: false,
  isFreeEnterprise: false,
  checkUpgrade: () => false,
  isThemeAllowed: async () => false
});

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const planInfo = usePlanInfo();
  
  // Only show error toast for genuine errors, not auth session missing
  useEffect(() => {
    if (planInfo.error && !planInfo.loading && planInfo.error !== "Auth session missing!") {
      console.error("Plan loading error:", planInfo.error);
      toast.error("Plan Loading Error", {
        description: planInfo.error,
        duration: 5000,
      });
    }
  }, [planInfo.error, planInfo.loading]);
  
  // Helper function to check if user has access to a premium/enterprise feature
  const checkUpgrade = (feature: string, isPremiumOnly = false): boolean => {
    console.log("🔍 Checking upgrade for feature:", feature, {
      isPremiumOnly,
      userIsPremium: planInfo.isPremium,
      userIsEnterprise: planInfo.isEnterprise,
      userIsFreeEnterprise: planInfo.isFreeEnterprise
    });
    
    if (planInfo.isEnterprise) {
      console.log(`✅ Enterprise user has access to ${feature}`);
      return true;
    }
    
    if (planInfo.isFreeEnterprise) {
      console.log(`✅ Free Enterprise user has access to ${feature}`);
      return true;
    }
    
    if (planInfo.isPremium && isPremiumOnly) {
      console.log(`✅ Premium user has access to ${feature}`);
      return true;
    }
    
    if (!isPremiumOnly && planInfo.isPremium) {
      console.log(`✅ Premium user has access to ${feature}`);
      return true;
    }
    
    // Show upgrade toast
    const requiredPlan = isPremiumOnly ? "Professional" : "Enterprise";
    console.log(`❌ Access denied for ${feature}, requires ${requiredPlan} plan`);
    toast.error(`${feature} requires a ${requiredPlan} plan`, {
      description: `Upgrade your plan to access this feature`,
      duration: 5000,
    });
    
    return false;
  };
  
  // Check if a specific theme is allowed for the current plan
  const isThemeAllowed = async (themeName: string): Promise<boolean> => {
    try {
      console.log(`🎨 Checking theme access for ${themeName} with plan status: Premium=${planInfo.isPremium}, Enterprise=${planInfo.isEnterprise}, FreeEnterprise=${planInfo.isFreeEnterprise}`);
      
      // All themes allowed for premium, enterprise, and free enterprise users
      if (planInfo.isPremium || planInfo.isEnterprise || planInfo.isFreeEnterprise) {
        console.log(`✅ Theme ${themeName} is allowed for premium/enterprise/free enterprise users`);
        return true;
      }
      
      // For basic/free users, use the restrictions
      const hasAccess = await checkThemeAccess(themeName);
      console.log(`🎨 Theme access check for ${themeName}: ${hasAccess}`);
      
      if (!hasAccess) {
        toast.error(`The ${themeName} theme requires a Professional plan`, {
          description: "Upgrade to access premium themes"
        });
      }
      
      return hasAccess;
    } catch (error) {
      console.error("❌ Error checking theme access:", error);
      return false;
    }
  };
  
  // Log plan information when it changes for debugging
  useEffect(() => {
    if (!planInfo.loading) {
      console.log("📊 Plan context updated:", {
        planName: planInfo.planName,
        isPremium: planInfo.isPremium,
        isEnterprise: planInfo.isEnterprise,
        isFreeEnterprise: planInfo.isFreeEnterprise,
        hasRestrictions: !!planInfo.restrictions,
        error: planInfo.error
      });
    }
  }, [planInfo.loading, planInfo.planName, planInfo.isPremium, planInfo.isEnterprise, planInfo.isFreeEnterprise, planInfo.restrictions, planInfo.error]);
  
  return (
    <PlanContext.Provider value={{
      ...planInfo,
      checkUpgrade,
      isThemeAllowed
    }}>
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook to use the plan context
export const usePlan = () => {
  const context = useContext(PlanContext);
  console.log("🎯 usePlan hook called, returning:", {
    planName: context.planName,
    loading: context.loading,
    error: context.error,
    isPremium: context.isPremium,
    isEnterprise: context.isEnterprise,
    isFreeEnterprise: context.isFreeEnterprise
  });
  return context;
};

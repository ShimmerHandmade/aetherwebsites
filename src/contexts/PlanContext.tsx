
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
  checkUpgrade: () => false,
  isThemeAllowed: async () => false
});

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const planInfo = usePlanInfo();
  
  // Helper function to check if user has access to a premium/enterprise feature
  // and show an upgrade toast if they don't
  const checkUpgrade = (feature: string, isPremiumOnly = false): boolean => {
    if (planInfo.isEnterprise) {
      return true; // Enterprise users have access to everything
    }
    
    if (planInfo.isPremium && isPremiumOnly) {
      return true; // Premium users have access to premium features
    }
    
    // Show upgrade toast
    const requiredPlan = isPremiumOnly ? "Professional" : "Enterprise";
    toast.error(`${feature} requires a ${requiredPlan} plan`, {
      description: `Upgrade your plan to access this feature`,
      duration: 5000,
    });
    
    return false;
  };
  
  // Check if a specific theme is allowed for the current plan
  const isThemeAllowed = async (themeName: string): Promise<boolean> => {
    try {
      // All themes allowed for premium and enterprise users
      if (planInfo.isPremium || planInfo.isEnterprise) {
        console.log(`Theme ${themeName} is allowed for premium/enterprise users`);
        return true;
      }
      
      // For basic/free users, use the restrictions
      const hasAccess = await checkThemeAccess(themeName);
      console.log(`Theme access check for ${themeName}: ${hasAccess}`);
      
      if (!hasAccess) {
        toast.error(`The ${themeName} theme requires a Professional plan`, {
          description: "Upgrade to access premium themes"
        });
      }
      
      return hasAccess;
    } catch (error) {
      console.error("Error checking theme access:", error);
      return false;
    }
  };
  
  // Log plan information when it changes for debugging
  useEffect(() => {
    if (!planInfo.loading) {
      console.log("Plan context updated:", {
        planName: planInfo.planName,
        isPremium: planInfo.isPremium,
        isEnterprise: planInfo.isEnterprise,
        hasRestrictions: !!planInfo.restrictions
      });
    }
  }, [planInfo.loading, planInfo.planName, planInfo.isPremium, planInfo.isEnterprise, planInfo.restrictions]);
  
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
export const usePlan = () => useContext(PlanContext);

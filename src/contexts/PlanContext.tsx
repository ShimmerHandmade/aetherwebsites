
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { usePlanInfo, PlanInfo } from "@/hooks/usePlanInfo";
import { toast } from "sonner";

// Create context with default values
const PlanContext = createContext<PlanInfo & {
  checkUpgrade: (feature: string, isPremiumOnly?: boolean) => boolean;
}>({
  planName: null,
  restrictions: null,
  loading: true,
  error: null,
  isPremium: false,
  isEnterprise: false,
  checkUpgrade: () => false
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
    toast.error(`${feature} requires an ${requiredPlan} plan`, {
      description: `Upgrade your plan to access this feature`
    });
    
    return false;
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
      checkUpgrade
    }}>
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook to use the plan context
export const usePlan = () => useContext(PlanContext);
